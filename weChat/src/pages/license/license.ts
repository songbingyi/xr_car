import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {Location} from '@angular/common';

import { Observable } from 'rxjs/Rx';

import { SkinType, InputType } from 'ngx-weui';
import { DialogService, DialogConfig, DialogComponent } from 'ngx-weui/dialog';
import { ToastService } from 'ngx-weui/toast';
import { PopupComponent } from 'ngx-weui/popup';

@Component({
    selector    : 'app-license',
    templateUrl : './license.html',
    styleUrls   : ['./license.scss'],
    encapsulation : ViewEncapsulation.None
})
export class LicenseComponent implements OnInit {

    @ViewChild('ios') iosAS: DialogComponent;
    @ViewChild('full') fullPopup: PopupComponent;

    shouldReservation: Boolean = false;
    shouldReservationBox: Boolean = true;
    showLicenseType: Boolean = false;


    result : any = {
        city: '',
        licenseType: ''
    };

    cityArray = {
        'A' : [{name: '西安', tel: '029'}, {name: '咸阳', tel: '022'}, {name: '宝鸡', tel: '023'}],
        'B' : [{name: '汉中', tel: '026'}, {name: '安康', tel: '028'}, {name: '商洛', tel: '027'}]
    };

    selectedLicense: any = null;
    itemsRadio : any[] = [
        {id: 1, name: 'A照'}, {id: 2, name: 'B照'}, {id: 3, name: 'C照'}
    ];

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

    select(item) {
        this.result.city = item.name;
        this.fullPopup.close();
    }

    showLicenseTypeBox() {
        this.showLicenseType = !this.showLicenseType;
    }


    selectLicenseType() {
        this.result.licenseType = this.selectedLicense;
        this.selectedLicense = null;
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.showLicenseType = false;
    }

}
