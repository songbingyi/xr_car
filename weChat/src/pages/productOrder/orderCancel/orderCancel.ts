import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogService, DialogConfig } from 'ngx-weui/dialog';

import { ToastComponent, ToastService } from 'ngx-weui/toast';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

import { config } from '../../../app/app.config';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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

    roleId: String = '';
    orderId: String = '';

    canCloseOrderStatus = ["1002", "1003"];


    submitting:boolean = false;
    comments   = new FormControl('', []);
    orderForm: FormGroup = this.builder.group({
        comments     : this.comments
    });
    fromError: Boolean = false;

    constructor(private builder: FormBuilder, private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.roleId = this.route.snapshot.queryParams.role;
        this.getInitData(this.orderId, this.roleId);
    }

    getInitData(id?, roleId?) {
        this.isLoaded = false;
        this.baseService.mockGet('gerCarProductOrderDetail', {
            'car_product_order_id' : id,
            'member_role_id' : roleId
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.car_product_order_info;
                    // this.detail.car_product_order_status_info.car_product_order_status_id = '32';
                    // this.detail.car_product_order_status_info.service_order_status_name = '未到站';
                    // this.detail.service_order_comment = "经服务人员反馈，您在预约时间内未到站进行审车。您可修改预约时间，并重新提交审核。在通知后72小时未进行操作，该订单将自动取消并退款。";
                    if (!this.detail.car_product_order_id) {
                        this.showToast('没有找到此订单！');
                        this.hideToast(() => {
                            this.goBack();
                            // this.router.navigate(['/serviceOrder', 0]);
                        });
                    }
                } else {
                    this.errorMessage = detail.status.error_desc;
                    if (detail.status.error_code === '4004') {
                        setTimeout(() => {
                            this.goBack();
                            //this.router.navigate(['/serviceOrder', 0]);
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

    canCloseOrder() {
        // 角色为 3 时的待分配或者待处理，可以关闭
        let orderStatus = this.detail && this.detail.car_product_order_status_info;
        return this.roleId === '3' && orderStatus && this.canCloseOrderStatus.indexOf(orderStatus.car_product_order_status_id) > -1;
    }

    focused() {
        this.errorMessage = null;
        console.log(this.errorMessage);
    }

    /**
     * 1-取消订单
     * 2-删除订单
     * 3-分配给经销商
     * 4-经销商确认订单
     */
    // 删除
    cancelOrder(id?) {
        if(this.roleId === '3' && !this.orderForm.controls.comments.value){
            this.errorMessage = '请先输入关闭订单的原因！';
            return;
        }
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要关闭此订单吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(this.detail.car_product_order_id, 1);
            }
        });
        return false;
    }

    operation(id, operation) {
        this.baseService.post('operatorCarProductOrder', {
            'operator_type': operation,
            'submit_car_product_order_info' : {
                'institution_dealer_info' : {},
                'outer_dms_no' : '',
                'car_product_order_description' : this.orderForm.controls.comments.value // 订单描述(1-取消原因)
            },
            'car_product_order_id' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.getInitData(this.orderId, this.roleId);
                    // this.detail = detail.data.service_order_info;
                    // this.showResult(operation);
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
