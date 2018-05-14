import {Component, OnInit} from '@angular/core';
import {NgZone, OnDestroy} from '@angular/core';

import {BaseProvider} from '../../providers/http/base.http';
import {Router} from "@angular/router";
import {MessageService} from '../../providers/messageService';
import {LocalStorage} from '../../providers/localStorage';

import {RefreshMemberInfoService} from '../../providers/refresh.member.info.service';

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

    constructor(private zone : NgZone, private baseService : BaseProvider, private router: Router, private message: MessageService, private localStorage: LocalStorage) {
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
                        this.member.member_role_list = member.data.member_role_list || [];
                        this.isSeller(this.member.member_role_list);
                        if(this.member.member_role_list) {
                            this.localStorage.setObject('member_role_list', this.member.member_role_list);
                        }
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    isSeller(memberRoleList){
        let ids = [];
        memberRoleList.forEach(role=>{
            ids.push(role.member_role_id);
        });
        //this.isSellerRole = ids.indexOf('2') > -1;
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

    hasNotify(key, orderType) {
        let orderTypeObj = {};
        if(orderType){
            orderTypeObj = this.member[orderType];
        }else{
            orderTypeObj = this.member.service_order_dashboard_info;
        }
        return orderTypeObj && orderTypeObj[key] !== '0';
    }

    refresh() {
        this.ngOnInit();
        this.hasCar();
    }

    goNext() {
        if (this.carList.length) {
            this.router.navigate(['/carList']);
        }else{
            this.router.navigate(['/carInfo']);
        }
    }
}
