import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap, NavigationStart, NavigationEnd} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../providers/http/base.http';
import {LocalStorage} from '../../providers/localStorage';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.html',
    styleUrls: ['./orders.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersComponent implements OnInit {
    status: string;
    key: string;
    activeIndex: any;
    isLoaded: boolean;

    subscribe: any;

    order_type: Number;

    all: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };
    needPay: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };
    needProcess: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };
    processing: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };
    hasDone: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };

    service_order_dashboard_info: any;

    errorMessage: any;

    maps: any = {
        'all': 'order_total_count',
        'needPay': 'order_obligation_count',
        'needProcess': 'order_pending_count',
        'processing': 'order_process_count',
        'hasDone': 'order_finish_count'
    };
    objName: any = ['全部订单', '待付款', '待处理', '处理中', '已完成'];
    objKey: any = ['all', 'needPay', 'needProcess', 'processing', 'hasDone'];

    constructor(private route: ActivatedRoute, private router: Router, private baseService: BaseProvider, private localStorage: LocalStorage) {
        /*this.router.events.subscribe(event => {
            if(event instanceof NavigationEnd) {
                console.log(event);
                this.getInitData();
            }
        });*/
    }

    ngOnInit() {
        // let activeIndex: string = this.route.snapshot.paramMap.get('status');
        // let page: string = this.route.snapshot.paramMap.get('page');
        this.getService_order_dashboard_info();

        this.subscribe = this.route.params.subscribe(params => {
            // console.log(params);
            let activeIndex: string = params.status;
            let page: string = params.page;
            this.activeIndex = parseInt(activeIndex, 10);
            this.order_type = this.activeIndex;
            this.key = this.objKey[this.activeIndex];
            this[this.key].pagination.page = page;
            this.getInitData();
        });
    }

    getService_order_dashboard_info() {
        this.service_order_dashboard_info = this.localStorage.getObject('service_order_dashboard_info');
    }

    hasNotify(key, type) {
        /*if(type){
            if(this[type].lists.length) {
                return this[type].lists.length > 0;
            }else{
                return false;
            }
        }*/
        return this.service_order_dashboard_info && this.service_order_dashboard_info[key] !== '0' && this.service_order_dashboard_info[key] !== 0;
    }

    onTabSelect(event) {
        this.order_type = event;
        this.key = this.objKey[event];
        // this[this.key].pagination.page ++;
        //this.getInitData();
        this.activeIndex = event;
        this.router.navigate(['/orders', event, this[this.key].pagination.page]);
        // this.getInitData();
    }

    getInitData() {
        this[this.key].isLoaded = false;
        this.baseService.post('getServiceOrderList', {
            'pagination': this[this.key].pagination,
            'filter_value': {order_type: this.order_type}
        })
            .subscribe(lists => {
                if (lists.status.succeed === '1') {
                    let paginated = lists.paginated;
                    this[this.key].isLoaded = true;
                    this[this.key].lists = lists.data.service_order_list;
                    this.service_order_dashboard_info[this.maps[this.key]] = this[this.key].lists.length;
                    /*{
                        "order_total_count":"3",
                        "order_obligation_count":"3",
                        "order_pending_count":"0",
                        "order_process_count":"0",
                        "order_finish_count":"0"
                    }*/
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
        this.key = this.objKey[type];
        this[this.key].pagination.page = $event;
        // this.getInitData();
        this.router.navigate(['/orders', this.activeIndex, $event]);
        this.getInitData();
    }

    goPayment($event, service_order_id) {
        $event.stopPropagation();
        if (service_order_id) {
            window.location.href = '/payment?oid=' + service_order_id;
        }
    }


    getServiceProductSpecTypeInfoByKey(key, detail) {
        let productSpecTypes = (detail && detail.service_order_product_info) ? detail.service_order_product_info.service_order_product_extend_list : [];
        let length = productSpecTypes.length;
        for (let i = 0; i < length; i++) {
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
        if (item) {
            return (item.service_order_status_info.service_order_status_id === '10' || item.service_order_status_info.service_order_status_id === '22');
        }
    }

    showText(item?) {
        if (item) {
            let status_id = item.service_order_status_info.service_order_status_id;
            let text = ['支付金额：', '退款金额：'];
            let status = ['61', '62'];
            return status.indexOf(status_id) > -1 ? text[1] : text[0];
        }
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }

}
