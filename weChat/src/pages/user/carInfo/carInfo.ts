import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
    carTypes     : any = [];

    provinces : Array<any>;
    groupedProvince : Array<any>;
    selectedProvince : any;

    selectedCarProperty: any;
    selectedCarType: any;

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

    constructor(private route : ActivatedRoute, private router: Router, private builder : FormBuilder, private customValidators : CustomValidators, private baseService : BaseProvider) {
        this.getInitData();
        this.getCarDetail();
    }

    ngOnInit() {
    }

    getInitData() {
        this.baseService.post('getProvinceCodeList', {})
            .subscribe(provinces => {
                if (provinces.status.succeed) {
                    this.provinces = provinces.data.province_code_list;
                    this.selectedProvince = this.provinces[0];
                    this.selectedProvince.selected = true;
                    this.result.a = this.selectedProvince;
                    this.groupProvince();
                } else {
                    this.errorMessage = provinces.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getCarPropertyList', {})
            .subscribe(carProperties => {
                if (carProperties.status.succeed) {
                    this.carProperties = carProperties.data.car_property_list;
                } else {
                    this.errorMessage = carProperties.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getCarTypeList', {})
            .subscribe(carTypes => {
                if (carTypes.status.succeed) {
                    this.carTypes = carTypes.data.car_type_list;
                } else {
                    this.errorMessage = carTypes.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    validators(result) {
        this.errorMessage = '';
        return this.customValidators.isValid(result || this.result);
    }

    getCarDetail() {
        this.route.data
            .subscribe((data) => {
            console.log(data);
                if (data.car_id) {
                    this.setCarDetail(data);
                }
            });
        let item = this.route.snapshot.paramMap.get('item');
        /*if (item) {
            this.setCarDetail(item);
        }*/
    }

    setCarDetail(item) {
        console.log(item);
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
        this.result.e = this.selectedCarType;
        this.result.e.valid = true;
        this.validators(this.result);
        this.selectedCarType = null;
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
