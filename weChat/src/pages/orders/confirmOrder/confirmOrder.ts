import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';


@Component({
    selector    : 'app-confirm-order',
    templateUrl : './confirmOrder.html',
    styleUrls   : ['./confirmOrder.scss']
})
export class ConfirmOrderComponent implements OnInit {

    mode : String = 'license';
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
        let service_order_id = this.order.service_order_id;
        window.location.href = window.location.protocol + '//' + window.location.host + '/payment/' + service_order_id;
    }

    changeMode(type) {
        this.mode = type;
    }

}
