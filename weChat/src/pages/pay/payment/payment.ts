import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent, ToastService} from 'ngx-weui/toast';

@Component({
    selector    : 'app-payment',
    templateUrl : './payment.html',
    styleUrls   : ['./payment.scss']
})
export class PaymentComponent implements OnInit {

    @ViewChild('success') successToast: ToastComponent;
    @ViewChild('loading') loadingToast: ToastComponent;

    constructor(private srv: ToastService) { }

    ngOnInit() {

    }

    onShow(type: 'success' | 'loading') {
        (<ToastComponent>this[`${type}Toast`]).onShow();
    }


}
