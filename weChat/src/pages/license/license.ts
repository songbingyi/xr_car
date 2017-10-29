import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {Location} from '@angular/common';

import { Observable } from 'rxjs/Rx';

import { SkinType, InputType } from 'ngx-weui';
import { DialogService, DialogConfig, DialogComponent } from 'ngx-weui/dialog';
import { ToastService } from 'ngx-weui/toast';

@Component({
    selector    : 'app-license',
    templateUrl : './license.html',
    styleUrls   : ['./license.scss'],
    encapsulation : ViewEncapsulation.None
})
export class LicenseComponent implements OnInit {

    @ViewChild('ios') iosAS: DialogComponent;

    shouldReservation: Boolean = false;
    shouldReservationBox: Boolean = true;

    private config: DialogConfig = <DialogConfig>{
        title: '返回',
        content: '离开此页面，资料将不会保存，是否离开？',
        cancel: '是',
        confirm: '否'
    };

    showNext: Boolean = false;

    constructor(private router: Router, private location: Location) {
    }

    ngOnInit() {
    }

    onTabSelect(event) {
        console.log(event);
        if (event === false) {
            this.shouldReservationBox = false;
            console.log('需要填写信息！');
        }
        return false;
    }

    goToUser() {
        this.router.navigate(['/userInfo']);
    }

    onShow(type: SkinType = 'ios', style: 1) {
        (<DialogComponent>this[`${type}AS`]).show().subscribe((res: any) => {
            console.log('type', res);
            if (!res.value) {
                // this.location.back();
                this.showNext = !this.showNext;
            }
        });

        return false;
    }

}
