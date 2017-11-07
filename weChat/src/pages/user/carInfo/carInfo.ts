import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';

import {CustomValidators} from '../../../providers/custom.validators';

import {BaseProvider} from '../../../providers/http/base.http';

@Component({
    selector    : 'app-car-info',
    templateUrl : './carInfo.html',
    styleUrls   : ['./carInfo.scss']
})
export class CarInfoComponent implements OnInit {

    showPanel : Boolean = false;
    isShowImage : Boolean = false;

    showIdType : Boolean = false;
    showCarType : Boolean = false;

    errorMsg : any;

    provinces : Array<any>;
    groupedProvince : Array<any>;
    selectedProvince : any;

    rowLength : any = 10; // 每行几个省

    cardId = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6)
    ]);
    companyName = new FormControl('', [
        Validators.required,
        this.customValidators.eq(18)
    ]);
    phone = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    vcode = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);

    cardIdv = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    cardIdx = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);


    carInfoForm : FormGroup = this.builder.group({
        cardId      : this.cardId,
        companyName : this.companyName,
        phone       : this.phone,
        vcode       : this.vcode,
        cardIdv     : this.cardIdv,
        cardIdx     : this.cardIdx
    });

    result = {
        a: '',
        b: '',
        c: '',
        d: '',
        e: '',
        f: '',
        g: ''
    };

    constructor(private builder : FormBuilder, private customValidators : CustomValidators, private baseService : BaseProvider) {
        this.getInitData();
    }

    ngOnInit() {
    }

    getInitData() {
        this.baseService.get('getProvinceCodeList.mock.json')
            .subscribe(provinces => {
                this.provinces = provinces;
                this.selectedProvince = provinces[0];
                this.selectedProvince.selected = true;
                this.result.a = this.selectedProvince;
                this.groupProvince();
            }, error => this.errorMsg = <any>error);
    }

    groupProvince() {
        let groups = [];
        let provinces = this.provinces;
        let colLength = Math.ceil(provinces.length / this.rowLength);

        for (let i = 0; i < colLength; i++) {
            groups.push(provinces.slice((i * this.rowLength), (i + 1) * this.rowLength));
        }

        this.groupedProvince = groups;
    }

    selected(province) {
        this.selectedProvince.selected = false;
        province.selected = true;
        this.selectedProvince = province;
    }

    confirmSelect() {
        this.result.a = this.selectedProvince;
        this.showPanel = false;
    }

    showImage() {
        this.isShowImage = !this.isShowImage;
    }

    showIdTypeBox() {
        this.showIdType = !this.showIdType;
    }

    showCarTypeBox() {
        this.showCarType = !this.showCarType;
    }

    selectIdType() {
        this.cancelTypeBox();
    }

    selectCarType() {
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.showIdType = false;
        this.showCarType = false;
    }

    save() {
        if (this.carInfoForm.invalid) {
            this.errorMsg = '请修改红色错误信息后再提交!';
        }else{
            this.errorMsg = '';
        }
        console.log(this.carInfoForm.value);
    }

    onItemChange(data : any) {
        console.log('onItemChange', data);
    }

    onItemGroupChange(data : any) {
        console.log('onItemGroupChange', data);
    }

    onItemCancel() {
        console.log('onItemCancel');
    }
}
