import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

@Component({
    selector    : 'app-product-order-complete',
    templateUrl : './orderComplete.html',
    styleUrls   : ['./orderComplete.scss']
})
export class ProductOrderCompleteComponent implements OnInit {
    isSuccess : Boolean = false;
    errorMessage : any;
    order: any;
    isLoaded: Boolean = false;
    orderId: string;

    constructor(private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id');
        // this.loadOrder(id);
    }

    /*loadOrder(id) {
        this.baseProvider.post('getServiceOrderDetail', {
            'service_order_id': id
        }).subscribe(order => {
                if (order.status.succeed === '1') {
                    this.order = order.data.service_order_info;
                    this.orderId = this.order.service_order_id;
                    this.isLoaded = true;
                } else {
                    this.errorMessage = order.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }*/

}
