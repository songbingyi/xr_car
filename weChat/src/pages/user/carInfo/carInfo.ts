import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {CustomValidators} from '../../../providers/custom.validators';

import {BaseProvider} from '../../../providers/http/base.http';
import {LocalStorage} from '../../../providers/localStorage';

import { errorCode } from '../../../assets/data/error.code';

@Component({
    selector    : 'app-car-info',
    templateUrl : './carInfo.html',
    styleUrls   : ['./carInfo.scss']
})
export class CarInfoComponent implements OnInit {

    carInfo: any;

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

    // 编辑时使用下面两个字段
    company_id: string;
    car_id: string;

    cardId = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);
    companyName = new FormControl('', [
        Validators.required
    ]);

    cardIdv = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);
    cardIdx = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);


    carInfoForm : FormGroup = this.builder.group({
        cardId      : this.cardId,
        companyName : this.companyName,
        cardIdv     : this.cardIdv,
        cardIdx     : this.cardIdx
    });

    result: any = {
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

    constructor(private route : ActivatedRoute, private router: Router, private builder : FormBuilder, private customValidators : CustomValidators, private baseService : BaseProvider, private localStorage: LocalStorage) {
        this.getInitData();
    }

    ngOnInit() {
        this.getCarDetail();
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
        let carInfo = this.localStorage.getObject('carInfo');
        if (carInfo.car_id) {
            this.setCarDetail(carInfo);
        }
        this.localStorage.remove('carInfo');
    }

    setCarDetail(item) {
        this.car_id = item.car_id;
        this.company_id = item.company_info.company_id;

        this.carInfoForm.setValue({
            cardId: item.plate_no,
            companyName: item.company_info.company_name,
            cardIdv: item.vin_no,
            cardIdx: item.engine_no
        });

        this.result = {
            a: {
                province_code_id : item.province_code_info.province_code_id,
                province_code_name : item.province_code_info.province_code_name,
                selected : true,
                valid: true
            },
            b: {
                value : item.plate_no,
                valid: true
            },
            c: {
                value : item.company_info.company_name,
                valid: true
            },
            d: {
                car_property_id : item.car_property_info.car_property_id,
                car_property_name : item.car_property_info.car_property_name,
                valid: true
            },
            e: {
                car_type_id : item.car_type_info.car_type_id,
                car_type_name : item.car_type_info.car_type_name,
                valid: true
            },
            f: {
                value : item.vin_no,
                valid: true
            },
            g: {
                value : item.engine_no,
                valid: true
            }
        };

        // console.log(this.carInfoForm);
        // console.log(item);
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

    setItem(name, obj) {
        // console.log(obj);
        this.result[name].value = obj.value;
        this.validators(this.result);
    }

    filterData(result) {
        return {
            'member_id' : '1',
            'car_info' : {
                'car_id' : '',
                'province_code_info' : {
                    'province_code_id' : result.a.province_code_id,
                    'province_code_name' : result.a.province_code_name
                },
                'plate_no' : result.b.value,
                'company_info' : {
                    'company_id' : '',
                    'company_name' : result.c.value
                },
                'car_property_info' : {
                    'car_property_id' : result.d.car_property_id,
                    'car_property_name' : result.d.car_property_name
                },
                'car_type_info' : {
                    'car_type_id' : result.e.car_type_id,
                    'car_type_name' : result.e.car_type_name
                },
                'vin_no' : result.f.value,
                'engine_no' : result.g.value
            }
        };
    }

    submit() {
        if (this.car_id) {
            this.update();
        } else {
            this.save();
        }
    }

    save() {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            this.errorMessage = '所有信息为必填！';
            return;
        }
        this.errorMessage = '';

        console.log(result);

        let car_info = this.filterData(result);

        this.operation(0, car_info);
    }

    update() {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            this.errorMessage = '所有信息为必填！';
            return;
        }
        this.errorMessage = '';

        let car_info = this.filterData(result);

        this.operation(2, car_info);
    }

    delete(item) {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            this.errorMessage = '所有信息为必填！';
            return;
        }
        this.errorMessage = '';

        let car_info = this.filterData(result);

        this.operation(3, car_info);
    }

    operation(type, item) {
        let path = 'addMemberCar';
        if (type) {
            path = 'editMemberCar';
            item.operator_type = type;
            item.car_info.car_id = this.car_id;
            item.car_info.company_info.company_id = this.company_id;
        }
        this.baseService.post(path, item /*{
            'member_id' : '1',
            'operator_type' : type,
            'car_info' : {
                'car_id' : item.car_id,
                'province_code_info' : {
                    'province_code_id' : item.province_code_info.province_code_id,
                    'province_code_name' : item.province_code_info.province_code_name
                },
                'plate_no' : item.plate_no,
                'company_info' : {
                    'company_id' : item.company_info.company_id,
                    'company_name' : item.company_info.company_name
                },
                'car_property_info' : {
                    'car_property_id' : item.car_property_info.car_property_id,
                    'car_property_name' : item.car_property_info.car_property_name
                },
                'car_type_info' : {
                    'car_type_id' : item.car_type_info.car_type_id,
                    'car_type_name' : item.car_type_info.car_type_name
                },
                'vin_no' : item.vin_no,
                'engine_no' : item.engine_no
            }
        }*/)
            .subscribe(carList => {
                if (carList.status.succeed) {
                    this.carInfo = carList.data.member_car_list;
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
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
