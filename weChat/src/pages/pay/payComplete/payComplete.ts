import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

@Component({
    selector    : 'app-pay-complete',
    templateUrl : './payComplete.html',
    styleUrls   : ['./payComplete.scss']
})
export class PayCompleteComponent implements OnInit {
    isSuccess : Boolean = false;
    errorMessage : any;
    order: any;
    isLoaded: Boolean = false;
    orderId: Number;

    constructor(private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        let id: string = this.route.snapshot.paramMap.get('id');
        this.loadOrder(id);
    }

    loadOrder(id) {
        this.baseProvider.post('getServiceOrderDetail', {
            'service_order_id': id
        }).subscribe(order => {
                if (order.status.succeed === '1') {
                    this.order = order.data.service_order_info;
                    this.orderId = this.order.service_order_id;
                    this.isLoaded = true;
                    this.isPaySuccess(this.order);
                } else {
                    this.errorMessage = order.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    isPaySuccess(order) {
        /*
        *   21 已付款待审核
            22 已付款审核未通过
            31 已付款待处理
            32 已付款未处理
            41 已付款处理中
            51 已付款已完成
        */
        let statusArray = ['21', '22', '31', '32', '41', '51'];
        let status = order.service_order_status_info.service_order_status_id;

        this.isSuccess = statusArray.indexOf(status)>-1;
    }

}
