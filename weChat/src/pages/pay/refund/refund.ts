import {Component, OnInit, NgZone} from '@angular/core';
import {DialogConfig, DialogService} from 'ngx-weui/dialog';
import {BaseProvider} from '../../../providers/http/base.http';
import {ToastService} from 'ngx-weui/toast';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

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

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService, private zone: NgZone, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
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
                    // this.detail = detail.data.service_order_info;
                    this.showToast(id);
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    showToast(id) {
        this.toastService.success('退款申请已提交请耐心等待');
        setTimeout(() => {
            this.zone.run(() => {
                this.toastService.hide();
                this.router.navigate(['/orderDetail', (id.service_order_id || id)]);
            });
        }, 3000);
    }

    canRefund() {
        let status = ['22', '31', '32'];
        if(this.detail){
            let status_id = this.detail.service_order_status_info.service_order_status_id;
            return status.indexOf(status_id) > -1;
        }
        return false;
    }
}
