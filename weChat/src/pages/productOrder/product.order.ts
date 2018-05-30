import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap, NavigationStart, NavigationEnd} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../providers/http/base.http';
import {LocalStorage} from '../../providers/localStorage';
import {IdentityAuthService} from '../../providers/identityAuth.service';

@Component({
    selector: 'app-product-order',
    templateUrl: './product.order.html',
    styleUrls: ['./product.order.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductOrderComponent implements OnInit {
    status: string;
    key: string;
    activeIndex: any;
    isLoaded: boolean;

    role:any;

    memberRoleList:any = [];
    isSellerRole:boolean = false;

    subscribe: any;
    roleSubscribe: any;

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
    cancelled: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };

    car_product_order_dashboard_info: any;

    errorMessage: any;

    maps: any = {
        'all': 'order_total_count',
        'needPay': 'order_obligation_count',
        'needProcess': 'order_pending_count',
        'processing': 'order_process_count',
        'hasDone': 'order_finish_count',
        'cancelled': 'order_cancel_count'
    };
    objName: any = ['全部订单', '待处理', '处理中', '已完成', '已取消'];
    objKey: any = ['all', 'needProcess', 'processing', 'hasDone', 'cancelled'];

    roleMap = {
        '1':'普通会员',
        '2':'销售员',
        '3':'办事处人员',
        '4':'经销商人员',
    };

    constructor(private route: ActivatedRoute, private router: Router, private baseService: BaseProvider, private localStorage: LocalStorage, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
        // this.getMemberDetail();
        // this.memberRoleList = this.localStorage.getObject('member_role_list');

    }

    ngOnInit() {
        this.getCarProductOrderDashboardInfo();
        this.subscribe = this.route.params.subscribe(params => {
            let activeIndex: string = params.status;
            let page: string = params.page;
            this.activeIndex = parseInt(activeIndex, 10);
            this.order_type = this.activeIndex;
            this.key = this.objKey[this.activeIndex];
            this[this.key].pagination.page = page;

            this.roleSubscribe = this.route.queryParams.subscribe(queryParams => {
                this.role = queryParams.role || '1';
                this.getInitData();
                this.isSeller();
            });

        });
    }

    /*getMemberDetail() {
        this.baseService.post('getMemberDetail', {})
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        //this.member.member_auth_info = member.data.member_auth_info;
                        this.memberRoleList = member.data.member_role_list || [];
                        this.isSeller();
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }*/

    getCarProductOrderDashboardInfo() {
        this.car_product_order_dashboard_info = this.localStorage.getObject('car_product_order_dashboard_info');
    }

    isSeller(){
        /*let ids = [];
        this.memberRoleList.forEach(role=>{
            ids.push(role.member_role_id);
        });
        this.isSellerRole = ids.indexOf('2') > -1;*/
        this.isSellerRole = this.role === '2';
        console.log("this.role");
        console.log(this.role);
        console.log(this.isSellerRole);
        console.log("this.isSellerRole");
    }
    hasNotify(key, type) {
        /*if(type){
            if(this[type].lists.length) {
                return this[type].lists.length > 0;
            }else{
                return false;
            }
        }*/
        return this.car_product_order_dashboard_info && this.car_product_order_dashboard_info[key] !== '0' && this.car_product_order_dashboard_info[key] !== 0;
    }

    onTabSelect(event) {

        if(this.isSellerRole && event !== 0){
            event = event + 1;
        }
        //console.log(event);
        this.order_type = event;
        this.key = this.objKey[event];
        // this[this.key].pagination.page ++;
        //this.getInitData();
        this.activeIndex = event;
        this.router.navigate(['/productOrder', event, this[this.key].pagination.page], {queryParams:{role:this.role}});
        // this.getInitData();
    }

    getInitData() {
        this[this.key].isLoaded = false;
        this.baseService.post('gerCarProductOrderList', {
            'pagination': this[this.key].pagination,
            'filter_value': {
                order_type: this.order_type,
                member_role_info : {
                    member_role_id : this.role,
                    member_role_name : this.roleMap[this.role]
                }
            }
        }).subscribe(lists => {
                if (lists.status.succeed === '1') {
                    let paginated = lists.paginated;
                    this[this.key].isLoaded = true;
                    this[this.key].lists = lists.data.car_product_order_list;
                    //this.car_product_order_dashboard_info[this.maps[this.key]] = this[this.key].lists.length;
                    this[this.key].pagination.total = Math.ceil((paginated.total - 0) / paginated.count);
                } else {
                    this.errorMessage = lists.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    change($event, type) {
        this.key = this.objKey[type];
        this[this.key].pagination.page = $event;
        // this.getInitData();
        this.router.navigate(['/productOrder', this.activeIndex, $event], {queryParams:{role:this.role}});
        // this.getInitData();
    }

    /*goPayment($event, service_order_id) {
        $event.stopPropagation();
        if (service_order_id) {
            window.location.href = '/payment?oid=' + service_order_id;
        }
    }*/


    /*getServiceProductSpecTypeInfoByKey(key, detail) {
        let productSpecTypes = (detail && detail.service_order_product_info) ? detail.service_order_product_info.service_order_product_extend_list : [];
        let length = productSpecTypes.length;
        for (let i = 0; i < length; i++) {
            let productSpecType = productSpecTypes[i];
            if (productSpecType.service_product_spec_type_info.service_product_spec_type_key === key) {
                return productSpecType || {};
            }
        }
        return {};
    }*/

    /*shouldShowPlaceholderBtn(item) {
        return (item.car_product_order_status_info.is_pay === '1' && item.car_product_order_status_info.is_edit !== '1') || (item.car_product_order_status_info.is_pay !== '1' && item.car_product_order_status_info.is_edit === '1');
    }*/

    /*isWarning(item?) {
        if (item) {
            return (item.car_product_order_status_info.car_product_order_status_id === '10' || item.car_product_order_status_info.car_product_order_status_id === '22');
        }
    }*/

    /*showText(item?) {
        if (item) {
            let status_id = item.car_product_order_status_info.car_product_order_status_id;
            let text = ['支付金额：', '退款金额：'];
            let status = ['61', '62'];
            return status.indexOf(status_id) > -1 ? text[1] : text[0];
        }
    }*/

    ngOnDestroy() {
        this.subscribe.unsubscribe();
        //this.roleSubscribe.unsubscribe();
    }

}
