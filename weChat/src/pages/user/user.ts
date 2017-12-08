import {Component, OnInit} from '@angular/core';
import {NgZone, OnDestroy} from '@angular/core';

import {BaseProvider} from '../../providers/http/base.http';
import {Router} from "@angular/router";

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
        'service_order_dashboard_info': null,
    };
    carList: any = [];
    errorMessage: any;

    constructor(private zone : NgZone, private baseService : BaseProvider, private router: Router) {
        this.hasCar();
    }

    ngOnInit() {
        this.baseService.post('getMemberDashboard', {})
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        this.member = member.data;
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
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

    hasNotify(key) {
        return this.member.service_order_dashboard_info && this.member.service_order_dashboard_info[key] !== '0';
    }

    goNext() {
        if (this.carList.length) {
            this.router.navigate(['/carList']);
        }else{
            this.router.navigate(['/carInfo']);
        }
    }
}
