import {Component, OnInit} from '@angular/core';
import {DialogConfig, DialogService} from 'ngx-weui/dialog';
import {BaseProvider} from '../../../providers/http/base.http';
import {ToastService} from 'ngx-weui/toast';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector    : 'app-refund',
    templateUrl : './refund.html',
    styleUrls   : ['./refund.scss']
})
export class RefundComponent implements OnInit {

    errorMessage: any;
    detail: any;
    isLoaded: Boolean = false;
    dialogConfig: DialogConfig;

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService) {
    }

    ngOnInit() {
        let id: string = this.route.snapshot.paramMap.get('id');
        this.getInitData(id);
    }

    getInitData(id) {
        this.isLoaded = false;
        this.baseService.post('getServiceOrderDetail', {
            'service_order_id' : {'service_order_id' : id }
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    // 退款
    refundOrder(id) {
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要退款吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(id, '4');
            }
        });
        return false;
    }


    operation(id, operation) {
        this.baseService.post('operatorServiceOrder', {
            'operator_type': operation,
            'submit_service_order_info' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                    this.showToast();
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    showToast() {
        this.toastService.success('退款申请已提交请耐心等待');
        setTimeout(() => {
            this.toastService.hide();
        }, 3000);
    }

}
