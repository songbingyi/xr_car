import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector    : 'app-order-detail',
    templateUrl : './orderDetail.html',
    styleUrls   : ['./orderDetail.scss']
})
export class OrderDetailComponent implements OnInit {

    mode : String = 'cert';
    errorMessage: any;
    detail: any;
    isLoaded: Boolean = false;

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private sanitizer: DomSanitizer) {}

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
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    payOrder(service_order_id) {
        this.router.navigate(['/confirmOrder', service_order_id]);
        // window.location.href = window.location.protocol + '//' + window.location.host + '/payment/?oid=' + service_order_id;
    }


    /**
     * "操作类型
     * 1-付款
     * 2-取消订单
     * 3-删除订单
     * 4-申请退款"
     */
    // 修改
    editOrder(id) {

    }
    // 取消
    cancelOrder(id) {
        this.operation(id, 2);
    }
    // 删除
    deleteOrder(id) {
        this.operation(id, 3);
    }
    // 退款
    refundOrder(id) {
        this.operation(id, 4);
    }


    operation(id, operation) {
        this.baseService.post('getServiceOrderDetail', {
            'operator_type': operation,
            'submit_service_order_info' : id
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

    changeMode(type) {
        this.mode = type;
    }

    getServiceProductSpecTypeInfoByKey(key) {
        let detail = this.detail;
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



}
