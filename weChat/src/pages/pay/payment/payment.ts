import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent, ToastService} from 'ngx-weui/toast';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';

@Component({
    selector    : 'app-payment',
    templateUrl : './payment.html',
    styleUrls   : ['./payment.scss']
})
export class PaymentComponent implements OnInit {

    @ViewChild('success') successToast: ToastComponent;
    @ViewChild('loading') loadingToast: ToastComponent;

    order: any;
    errorMessage: any;
    isLoaded: Boolean = false;

    constructor(private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider) {}

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.loadOrder(id);
    }

    loadOrder(id) {
        this.baseProvider.post('getServiceOrderDetail', {
            'service_order_id': id
        }).subscribe(order => {
                if (order.status.succeed) {
                    this.order = order.data.service_order_info;
                    this.isLoaded = true;
                } else {
                    this.errorMessage = order.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    payOrder() {
        this.onShow('loading');
        let service_order_id = this.order.service_order_id;
        setTimeout(() => {
            this.onShow('success');
        }, 3000);
        setTimeout(() => {
            this.router.navigate(['/payComplete', service_order_id]);
        }, 5000);
    }

    onShow(type: 'success' | 'loading') {
        (<ToastComponent>this[`${type}Toast`]).onShow();
    }


}
