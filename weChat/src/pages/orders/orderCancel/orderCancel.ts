import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogService, DialogConfig } from 'ngx-weui/dialog';

import { ToastComponent, ToastService } from 'ngx-weui/toast';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

import { config } from '../../../app/app.config';

@Component({
    selector    : 'app-order-cancel',
    templateUrl : './orderCancel.html',
    styleUrls   : ['./orderCancel.scss']
})
export class OrderCancelComponent implements OnInit {

    mode : String = 'cert';
    errorMessage: any;
    detail: any;
    isLoaded: Boolean = false;
    dialogConfig: DialogConfig;
    isShowImage:Boolean = false;
    largerImg: String = '';

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        let id: string = this.route.snapshot.paramMap.get('id');
        this.getInitData(id);
    }

    getInitData(id?) {
        this.isLoaded = false;
        this.baseService.post('getServiceOrderDetail', {
            'service_order_id' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                    if (!this.detail.service_order_id) {
                        this.showToast('没有找到此订单！');
                        this.hideToast(() => {
                            this.goBack();
                        });
                    }
                } else {
                    this.errorMessage = detail.status.error_desc;
                    if (detail.status.error_code === '4004') {
                        setTimeout(() => {
                            this.goBack();
                        }, 2000);
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    goBack() {
        if(!config.identityAuth){
            this.location.back();
        }
    }

    /**
     * "操作类型
     * 1-付款
     * 2-修改订单
     * 3-删除订单 就是取消
     * 4-申请退款"
     */
    // 取消
    cancelOrder(id) {
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要取消此订单吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(id, 3);
            }
        });
        return false;
    }

    operation(id, operation) {
        this.baseService.post('operatorServiceOrder', {
            'operator_type': operation,
            'submit_service_order_info' : {'service_order_id' : id }
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.showResult();
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    showResult() {
        let msg = '取消订单成功！';
        this.showToast(msg);
        this.hideToast();
    }

    showToast(msg) {
        this.toastService.success(msg);
    }

    hideToast(callback?) {
        setTimeout(() => {
            this.toastService.hide();
            if (callback) {
                callback();
            }
        }, 2000);
    }
}
