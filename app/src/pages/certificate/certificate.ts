import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import { SkinType, InputType } from 'ngx-weui';
import { DialogService, DialogConfig, DialogComponent } from 'ngx-weui/dialog';

import { PopupComponent } from 'ngx-weui/popup';

@Component({
    selector      : 'app-certificate',
    templateUrl   : './certificate.html',
    styleUrls     : ['./certificate.scss'],
    encapsulation : ViewEncapsulation.None
})
export class CertificateComponent implements OnInit {

    @ViewChild('ios') iosAS: DialogComponent;
    @ViewChild('full') fullPopup: PopupComponent;

    shouldReservation : Boolean = false;
    shouldReservationBox : Boolean = true;

    showDateType: Boolean = false;

    private config: DialogConfig = <DialogConfig>{
        title: '返回',
        content: '离开此页面，资料将不会保存，是否离开？',
        cancel: '是',
        confirm: '否'
    };

    items : Array<any> = [
        {
            id        : 1,
            cardType  : '公户',
            carType   : '大型汽车',
            cardId    : '陕A·76243',
            isChecked : false
        }, {
            id        : 2,
            cardType  : '公户',
            carType   : '大型汽车',
            cardId    : '陕A·76243',
            isChecked : false
        },
        {
            id        : 3,
            cardType  : '公户',
            carType   : '大型汽车',
            cardId    : '陕A·76243',
            isChecked : false
        }
    ];

    showNext : Boolean = false;

    selectedDate : string;
    result : any = {
        city     : '',
        station  : null,
        date     : null,
        price    : 0,
        selected : null
    };

    cityArray = {
        'A' : [{name: '西安', tel: '029'}, {name: '咸阳', tel: '022'}, {name: '宝鸡', tel: '023'}],
        'B' : [{name: '汉中', tel: '026'}, {name: '安康', tel: '028'}, {name: '商洛', tel: '027'}]
    };

    itemsRadio : string[] = Array(10).fill('').map((v : string, idx : number) => `咸阳新盛检测站-${idx}`);
    dateRadio : string[] = Array(5).fill('').map((v : string, idx : number) => `11.${idx}`);


    constructor(private router : Router) {
        // this.res.checkbox = [this.items[0]];
    }

    onSave() {
        console.log('请求数据：' + JSON.stringify(this.result));
    }

    ngOnInit() {
    }

    onchange($event, item) {
        // console.log($event, item);
        // let checkbox = this.res.checkbox;
        // let length = checkbox.length;
        // this.res.checkbox = item; // checkbox.slice([length - 1], 1);
        // item.isChecked = true;
        console.log(this.result.selected);

        // console.log(this.items);
        return false;
    }

    onTabSelect(event) {
        console.log(event);
        if (event === false) {
            this.shouldReservationBox = false;
            console.log('需要填写信息！');
        }
        return false;
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

    next() {
        this.showNext = !this.showNext;
        this.onSave();
    }

    goToUser() {
        this.router.navigate(['/userInfo']);
    }

    showDateTypeBox() {
        this.showDateType = !this.showDateType;
    }

    select(item) {
        this.result.city = item.name;
        this.fullPopup.close();
    }

    selectDateType() {
        this.result.date = this.selectedDate;
        this.selectedDate = null;
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.selectedDate = null;
        this.showDateType = false;
    }


}
