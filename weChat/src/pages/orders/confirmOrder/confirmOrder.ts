import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';
import {PaymentTypeList} from '../../../providers/paymentType.service';


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
    isSinglePaymentType: boolean;
    isShowImage:Boolean = false;
    largerImg: String = '';

    constructor(private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private paymentTypeService: PaymentTypeList) {}

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.loadOrder(id);
        this.paymentTypeService.init();
        // this.isSinglePaymentType = this.paymentTypeService.getPaymentLength() === 1;
    }

    loadOrder(id) {
        this.baseProvider.post('getServiceOrderDetail', {
            'service_order_id': id
        }).subscribe(order => {
                if (order.status.succeed === '1') {
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
        window.location.href = window.location.protocol + '//' + window.location.host + '/payment/?oid=' + service_order_id;
    }

    getServiceProductSpecTypeInfoByKey(key) {
        let detail = this.order;
        let productSpecTypes = (detail && detail.service_order_product_info) ? detail.service_order_product_info.service_order_product_extend_list : [];
        let length = productSpecTypes.length;
        for ( let i = 0; i < length; i++) {
            let productSpecType = productSpecTypes[i];
            if (productSpecType.service_product_spec_type_info.service_product_spec_type_key === key) {
                return productSpecType || {};
            }
        }
        return {};
    }

    changeMode(type) {
        this.mode = type;
    }

    showImage(img?) {
        if(img){
            this.largerImg = img;
        }
        this.isShowImage = !this.isShowImage;
    }

}
