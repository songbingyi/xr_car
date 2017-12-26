import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { BaseProvider } from '../../providers/http/base.http';

@Component({
    selector    : 'app-orders',
    templateUrl : './orders.html',
    styleUrls   : ['./orders.scss'],
    encapsulation : ViewEncapsulation.None
})
export class OrdersComponent implements OnInit {
    status : string;
    key    : string;
    activeIndex: any;
    isLoaded: boolean;

    all: any = {
        pagination :  {
            page : 1,
            count: 10
        },
        lists : [],
        isLoaded : false
    };
    needPay: any = {
        pagination :  {
            page : 1,
            count: 10
        },
        lists : [],
        isLoaded : false
    };
    needProcess: any = {
        pagination :  {
            page : 1,
            count: 10
        },
        lists : [],
        isLoaded : false
    };
    processing: any = {
        pagination :  {
            page : 1,
            count: 10
        },
        lists : [],
        isLoaded : false
    };
    hasDone: any = {
        pagination :  {
            page : 1,
            count: 10
        },
        lists : [],
        isLoaded : false
    };

    errorMessage: any;

    objName : any = ['全部订单', '待付款', '待处理', '处理中', '已完成'];
    objKey : any = ['all', 'needPay', 'needProcess', 'processing', 'hasDone'];
    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider) {
    }

    ngOnInit() {
        let activeIndex: string = this.route.snapshot.paramMap.get('status');
        this.activeIndex = parseInt(activeIndex, 10);
        // this.status = this.objName[this.activeIndex];
        this.key    = this.objKey[this.activeIndex];
        this.getInitData();
    }

    onTabSelect(event) {
        // console.log(event);
        this.key    = this.objKey[event];
        // this[this.key].pagination.page ++;
        this.getInitData();
    }

    getInitData() {
        this[this.key].isLoaded = false;
        this.baseService.post('getServiceOrderList', {
            'pagination' : this[this.key].pagination,
            'type'       : this.key
        })
            .subscribe(lists => {
                if (lists.status.succeed === '1') {
                    let paginated = lists.paginated;
                    this[this.key].isLoaded = true;
                    this[this.key].lists = lists.data.service_order_list;
                    // this[this.key].lists[0].service_order_status_info.service_order_status_id = '61';
                    // this[this.key].lists[1].service_order_status_info.service_order_status_id = '62';
                    this[this.key].pagination.total = Math.ceil((paginated.total - 0) / paginated.count);
                    // console.log(this.key);
                    // console.log(this[this.key]);
                } else {
                    this.errorMessage = lists.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    change($event, type) {
        // console.log($event);
        this.key    = this.objKey[type];
        this[this.key].pagination.page = $event;
        this.getInitData();
    }

    goPayment($event, service_order_id) {
        $event.stopPropagation();
        if(service_order_id){
            window.location.href = '/payment?oid=' + service_order_id;
        }
    }


    getServiceProductSpecTypeInfoByKey(key, detail) {
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

    shouldShowPlaceholderBtn(item) {
        return (item.service_order_status_info.is_pay === '1' && item.service_order_status_info.is_edit !== '1') || (item.service_order_status_info.is_pay !== '1' && item.service_order_status_info.is_edit === '1');
    }

    isWarning(item?) {
        if( item ) {
            return (item.service_order_status_info.service_order_status_id === '10' || item.service_order_status_info.service_order_status_id === '22');
        }
    }

    showText(item?) {
        if(item){
            let status_id = item.service_order_status_info.service_order_status_id;
            let text = ['支付金额：', '退款金额：'];
            let status = ['61', '62'];
            return status.indexOf(status_id) > -1 ? text[1] : text[0];
        }
    }

}
