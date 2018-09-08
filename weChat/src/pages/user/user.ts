import {Component, OnInit} from '@angular/core';
import {NgZone, OnDestroy} from '@angular/core';

import {BaseProvider} from '../../providers/http/base.http';
import {Router} from "@angular/router";
import {MessageService} from '../../providers/messageService';
import {LocalStorage} from '../../providers/localStorage';

import {RefreshMemberInfoService} from '../../providers/refresh.member.info.service';
import { IdentityAuthService } from '../../providers/identityAuth.service';

@Component({
    selector    : 'app-user',
    templateUrl : './user.html',
    styleUrls   : ['./user.scss']
})
export class UserComponent implements OnInit {

    member: any = {
        'member_info' : {},
        'message_dashboard_info': {
            'new_message_count' : '0'
        },
        'member_auth_info' : {},
        'member_role_list' : [],
        'service_order_dashboard_info': null,
        'car_product_order_dashboard_info':null
    };
    carList: any = [];
    errorMessage: any;

    role_ids:any = [];

    memberRoles = {
        '2':'getSalesCarProductOrderDashboard',
        '3':'getOfficeCarProductOrderDashboard',
        '4':'getDealerCarProductOrderDashboard'
    };
    dataNames = {
        '2':'sales_car_product_order_dashboard_info',
        '3':'office_car_product_order_dashboard_info',
        '4':'dealer_car_product_order_dashboard_info'
    };
    dataItems:any = {
        'role2' : {},
        'role3' : {},
        'role4' : {}
    };

    constructor(private zone : NgZone, private baseService : BaseProvider, private router: Router, private message: MessageService, private localStorage: LocalStorage,private identityAuthService: IdentityAuthService) {
        this.identityAuthService.check();//没有注册不进入
        this.hasCar();
        this.getMemberDetail();
        this.message.getMessage().subscribe(msg => {
            if(msg.type === 'userRefresh'){
                this.refresh();
            }
        });
    }

    ngOnInit() {
        this.baseService.post('getMemberDashboard', {})
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        this.member = member.data;
                        //this.member.is_has_sales_button = '1';
                        if(this.member.service_order_dashboard_info) {
                            this.localStorage.setObject('service_order_dashboard_info', this.member.service_order_dashboard_info);
                        }
                        if(this.member.car_product_order_dashboard_info) {
                            this.localStorage.setObject('car_product_order_dashboard_info', this.member.car_product_order_dashboard_info);
                        }
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    getMemberDetail() {
        this.baseService.post('getMemberDetail', {})
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        this.member.member_auth_info = member.data.member_auth_info;
                        this.member.member_role_list = member.data.member_role_list || [/*
                            {
                                "member_role_id": "1",
                                "member_role_name": "普通会员"
                            },
                            {
                                "member_role_id": "2",
                                "member_role_name": "销售员"
                            },
                            {
                                "member_role_id": "3",
                                "member_role_name": "办事处人员"
                            },
                            {
                                "member_role_id": "4",
                                "member_role_name": "经销商人员"
                            }*/
                        ];
                        this.getRoleIds();
                        //this.isRole(this.member.member_role_list);
                        if(this.member.member_role_list && this.member.member_role_list.length) {
                            this.localStorage.setObject('member_role_list', this.member.member_role_list);
                        }
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    getOrderCount(role) {
        let path = this.memberRoles[role];
        if(path){
            this.baseService.post(path, {

            }).subscribe(orderDashboard => {
                        if (orderDashboard.status.succeed === '1') {
                            this.dataItems['role' + role] = orderDashboard.data[this.dataNames[role]];
                        } else {
                            this.errorMessage = orderDashboard.status.error_desc;
                        }
                    },
                    error => this.errorMessage = <any>error
                );
        }
    }

    getRoleIds(){
        let memberRoleList = this.member.member_role_list || [];
        this.role_ids = [];
        memberRoleList.forEach(role=>{
            this.role_ids.push(role.member_role_id);
        });
        this.role_ids.forEach((role)=>{
            if(this.isRole(role)){
                this.getOrderCount(role);
            }
        });
    }

    isRole(role){
        return this.role_ids.indexOf(role) > -1;
    }

    hasCar() {
        this.baseService.post('getMemberCarList', {})
            .subscribe(carList => {
                if (carList.status.succeed === '1') {
                    this.carList = carList.data.member_car_list;
                } else {
                    // this.errorMessage = carList.status.error_desc;
                }
            }, error => {
                // this.errorMessage = <any>error;
            });
    }

    hasNotify(key, orderType?) {
        let orderTypeObj = {};
        if(orderType){
            orderTypeObj = this.member[orderType];
        }else{
            orderTypeObj = this.member.service_order_dashboard_info;
        }
        return orderTypeObj && orderTypeObj[key] !== '0';
    }

    hasBadge(count){
        return count && count !== '0';
    }

    refresh() {
        this.ngOnInit();
        this.hasCar();
    }

    goToCarOrderList(status, page, query?, path?){
        path = '/' + (path || 'productOrder');
        query = query || {role: '1'};
        let orderCont = this.dataItems['role' + query.role];
        if(orderCont) {
            this.localStorage.setObject('car_product_order_dashboard_info', orderCont);
        }
        this.router.navigate([path, status, page], {queryParams:query});
    }

    goNext() {
        if (this.carList.length) {
            this.router.navigate(['/carList']);
        }else{
            this.router.navigate(['/carInfo']);
        }
    }
}
