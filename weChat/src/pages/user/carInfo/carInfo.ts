import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';

import {CustomValidators} from '../../../providers/custom.validators';

import {BaseProvider} from '../../../providers/http/base.http';

import { errorCode } from '../../../assets/data/error.code';

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

    errorMessage : any;

    carProperties: any = [];

    provinces : Array<any>;
    groupedProvince : Array<any>;
    selectedProvince : any;

    selectedCarProperty: any;

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
        a: {
            valid: true
        },
        b: {
            valid: true
        },
        c: {
            valid: true
        },
        d: {
            valid: true
        },
        e: {
            valid: true
        },
        f: {
            valid: true
        },
        g: {
            valid: true
        }
    };

    constructor(private builder : FormBuilder, private customValidators : CustomValidators, private baseService : BaseProvider) {
        this.getInitData();
    }

    ngOnInit() {
    }

    getInitData() {
        this.baseService.get('getProvinceCodeList')
            .subscribe(provinces => {
                if (provinces.status.succeed) {
                    this.provinces = provinces.data;
                    this.selectedProvince = this.provinces[0];
                    this.selectedProvince.selected = true;
                    this.result.a = this.selectedProvince;
                    this.groupProvince();
                } else {
                    // this.errorMessage = errorCode[provinces.status.error_code];
                    this.errorMessage = provinces.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.get('getCarPropertyList')
            .subscribe(carProperties => {
                if (carProperties.status.succeed) {
                    this.carProperties = carProperties.data;
                } else {
                    this.errorMessage = carProperties.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    validators(result) {
        this.errorMessage = '';
        return this.customValidators.isValid(result || this.result);
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
        this.result.d = this.selectedCarProperty;
        this.result.d.valid = true;
        this.validators(this.result);
        this.selectedCarProperty = null;
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
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            this.errorMessage = '所有信息为必填！';
            return;
        }
        this.errorMessage = '';
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
