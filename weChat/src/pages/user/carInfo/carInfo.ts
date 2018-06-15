import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {CustomValidators} from '../../../providers/custom.validators';

import {BaseProvider} from '../../../providers/http/base.http';
import {LocalStorage} from '../../../providers/localStorage';

// import {errorCode} from '../../../assets/data/error.code';
import { DialogService, DialogConfig } from 'ngx-weui/dialog';
import {Location} from '@angular/common';
import {IdentityAuthService} from '../../../providers/identityAuth.service';
// import { ToastComponent, ToastService } from 'ngx-weui/toast';

declare const Swiper: any;

@Component({
    selector: 'app-car-info',
    templateUrl: './carInfo.html',
    styleUrls: ['./carInfo.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CarInfoComponent implements OnInit {

    @ViewChild('wuiSwiper') Swiper;

    dialogConfig: DialogConfig;

    carInfo: any;

    operationType: String = 'add';
    shouldDelete: Boolean = false;

    showPanel: Boolean = false;
    isShowImage: Boolean = false;
    isShowListImage: Boolean = true;
    images = ['/assets/images/serialNo/1.jpg', '/assets/images/serialNo/2.jpg', '/assets/images/serialNo/3.jpg'];

    options: any = {
        roundLengths : true,
        initialSlide : 0,
        speed: 300,
        slidesPerView: 'auto',
        centeredSlides : true,
        followFinger : false,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        onInit: () => {
            console.log("Loaded");
        },
        onSlideChangeEnd: (swiper: any) => {

        }
    };

    showIdType: Boolean = false;
    showCarType: Boolean = false;

    errorMessage: any;

    carProperties: any = [];
    carTypes: any = [];

    provinces: Array<any>;
    groupedProvince: Array<any>;
    selectedProvince: any;

    selectedCarProperty: any;
    selectedCarType: any;

    rowLength: any = 10; // 每行几个省
    maxCar : Number = 3; // 最多几辆车

    // 编辑时使用下面两个字段
    company_id: string;
    car_id: string;

    hasCarInfo: any = {}; // 通过车牌号获取到已经存在的车辆信息

    cardId = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);
    companyName = new FormControl('', [
        Validators.required/*,
        this.customValidators.isChinese*/
    ]);

    cardIdv = new FormControl('', [
        Validators.required/*,
        this.customValidators.eq(17)*/
    ]);
    cardIdx = new FormControl('', [
        Validators.required
    ]);
    cardSerialNo = new FormControl('', [
        Validators.required
    ]);


    carInfoForm: any = this.builder.group({
        cardId: this.cardId,
        companyName: this.companyName,
        cardIdv: this.cardIdv,
        cardIdx: this.cardIdx,
        cardSerialNo: this.cardSerialNo
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
        },
        h: {
            valid: true
        }
    };

    fromError: Boolean = false;
    enoughCar: Boolean = false; // 是否已经有足够的车辆了。

    constructor(private route: ActivatedRoute, private router: Router, private builder: FormBuilder, private customValidators: CustomValidators, private baseService: BaseProvider, private localStorage: LocalStorage, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.getInitData();
        this.hasEnoughCar();
        this.identityAuthService.check();
    }

    ngOnInit() {
        this.getCarDetail();
        setTimeout(()=>{
            this.isShowListImage = false;
        }, 200);
    }

    loadSwiper () {
        //new Swiper('.swiper-container', this.options);
    }

    getInitData() {
        this.baseService.post('getProvinceCodeList', {})
            .subscribe(provinces => {
                if (provinces.status.succeed === '1') {
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
                if (carProperties.status.succeed === '1') {
                    this.carProperties = carProperties.data.car_property_list;
                } else {
                    this.errorMessage = carProperties.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getCarTypeList', {
            'parent_id': ''
        })
            .subscribe(carTypes => {
                if (carTypes.status.succeed === '1') {
                    this.carTypes = carTypes.data.car_type_list;
                } else {
                    this.errorMessage = carTypes.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    hasEnoughCar(callback?) {
        this.baseService.post('getMemberCarList', {})
            .subscribe(carList => {
                if (carList.status.succeed === '1') {
                    this.enoughCar = carList.data.member_car_list ? carList.data.member_car_list.length === this.maxCar : false;
                    if(callback){
                        callback(carList.data.member_car_list);
                    }
                } else {
                    if(callback){
                        callback([]);
                    }
                    // this.errorMessage = carList.status.error_desc;
                }
            }, error => {
                if(callback){
                    callback([]);
                }
                // this.errorMessage = <any>error;
            });
    }

    /*getMemberCarList() {
        this.baseService.post('getCarTypeList', {
            'parent_id' : ''
        })
            .subscribe(carTypes => {
                if (carTypes.status.succeed === '1') {
                    this.carTypes = carTypes.data.car_type_list;
                } else {
                    this.errorMessage = carTypes.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }*/

    validators(result) {
        this.errorMessage = '';
        return this.customValidators.isValid(result || this.result);
    }

    getCarDetail() {
        let carInfo = this.localStorage.getObject('carInfo');
        this.localStorage.remove('carInfo');

        if (carInfo.car_id) {
            this.operationType = 'edit';
            this.setCarDetail(carInfo);
            this.shouldDelete = carInfo.is_delete === '1';
        }
    }

    setCarDetail(item) {
        // console.log(item);
        this.car_id = item ? item.car_id : '';
        this.company_id = (item && item.company_info) ? item.company_info.company_id : '';

        this.carInfoForm.setValue({
            cardId: item ? item.plate_no : '',
            companyName: (item && item.company_info) ? item.company_info.company_name : '',
            cardIdv: (item && item.vin_no) ? item.vin_no : '',
            cardIdx: (item && item.engine_no) ? item.engine_no : '',
            cardSerialNo: (item && item.car_serial_no) ? item.car_serial_no : ''
        });

        this.result = {
            a: {
                province_code_id: (item && item.province_code_info) ? item.province_code_info.province_code_id : '',
                province_code_name: (item && item.province_code_info) ? item.province_code_info.province_code_name : '',
                selected: true,
                valid: true
            },
            b: {
                value: item ? item.plate_no : '',
                valid: true
            },
            c: {
                value: (item && item.company_info) ? item.company_info.company_name : '',
                valid: true
            },
            d: {
                car_property_id: (item && item.car_property_info) ? item.car_property_info.car_property_id : '',
                car_property_name: (item && item.car_property_info) ? item.car_property_info.car_property_name : '',
                valid: true
            },
            e: {
                car_type_id: (item && item.car_type_info) ? item.car_type_info.car_type_id : '',
                car_type_name: (item && item.car_type_info) ? item.car_type_info.car_type_name : '',
                valid: true
            },
            f: {
                value: item ? item.vin_no : '',
                valid: true
            },
            g: {
                value: item ? item.engine_no : '',
                valid: true
            },
            h: {
                value: item ? item.car_serial_no : '',
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
        this.hasCar(this.result.b.value);
    }

    confirmSelect() {
        this.result.a = this.selectedProvince;
        this.showPanel = false;
    }

    showImage() {
        this.isShowImage = !this.isShowImage;
    }

    showListImage(){
        this.isShowListImage = !this.isShowListImage;
        if(this.isShowListImage){
            this.loadSwiper();
        }
    }

    showIdTypeBox() {
        if (this.hasCarInfo.is_modify !== '0') {
            this.showIdType = !this.showIdType;
        }
    }

    showCarTypeBox() {
        if (this.hasCarInfo.is_modify !== '0') {
            this.showCarType = !this.showCarType;
        }
    }

    selectIdType() {
        if (!this.selectedCarProperty) {
            return;
        }
        this.result.d = this.selectedCarProperty;
        this.result.d.valid = true;
        this.validators(this.result);
        this.selectedCarProperty = null;
        this.cancelTypeBox();
    }

    selectCarType() {
        if (!this.selectedCarType) {
            return;
        }
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
        let controls = this.carInfoForm && this.carInfoForm.controls;
        this.result[name].value = obj.value;
        this.validators(this.result);
        if (name === 'b') {
            if(controls.cardId && controls.cardId.invalid && controls.cardId.value) {
                // console.log(controls.cardId.invalid);
                this.errorMessage = "车牌号码格式不正确";
            }else{
                this.errorMessage = '';
            }
        }
        if (name === 'c') {
            if(controls.companyName && controls.companyName.invalid && controls.companyName.value) {
                // console.log(controls.companyName.invalid);
                this.errorMessage = "所属公司名称应该用汉字填写";
            }else{
                this.errorMessage = '';
            }
        }

    }

    filterData(result, car_id?) {
        return {
            'car_info': {
                'car_id': car_id || '',
                'province_code_info': {
                    'province_code_id': result.a.province_code_id,
                    'province_code_name': result.a.province_code_name
                },
                'plate_no': result.b.value,
                'company_info': {
                    'company_id': '0',
                    'company_name': result.c.value
                },
                'car_property_info': {
                    'car_property_id': result.d.car_property_id,
                    'car_property_name': result.d.car_property_name
                },
                'car_type_info': {
                    'car_type_id': result.e.car_type_id,
                    'car_type_name': result.e.car_type_name
                },
                'vin_no': result.f.value,
                'engine_no': result.g.value,
                'car_serial_no' : result.h.value
            }
        };
    }

    submit() {
        if (this.car_id && this.operationType === 'edit') {
            this.update();
        }

        if (this.operationType === 'add') {
            this.save();
        }
    }

    save() {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            // this.errorMessage = '所有信息为必填！';
            this.fromError = true;
            return;
        }
        this.errorMessage = '';
        this.fromError = false;

        // console.log(result);

        let car_info = this.filterData(result, this.hasCarInfo.car_id || '');

        this.operation(0, car_info);
    }

    update() {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            // this.errorMessage = '所有信息为必填！';
            this.fromError = true;
            return;
        }
        this.errorMessage = '';
        this.fromError = false;

        let car_info = this.filterData(result);

        this.operation(2, car_info);
    }

    delete() {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid || this.carInfoForm.invalid) {
            // this.errorMessage = '所有信息为必填！';
            this.fromError = true;
            return;
        }
        this.errorMessage = '';
        this.fromError = false;

        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要删除此车辆吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                let car_info = this.filterData(result);
                this.operation(3, car_info);
            }
        });
        return false;
    }

    operation(type, item) {
        let path = 'addMemberCar';
        if (this.operationType === 'edit') {
            path = 'editMemberCar';
            item.operator_type = type;
            item.car_info.car_id = this.car_id;
            item.car_info.company_info.company_id = '0'; // this.company_id;
        }
        // console.log(path);
        // console.log(item);

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
                if (carList.status.succeed === '1') {
                    this.hasEnoughCar((list)=>{
                        if(list.length > 1){
                            this.location.back();
                        }else{
                            this.router.navigate(['/carList']);
                        }
                    });
                    // this.carInfo = carList.data.member_car_list;
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    hasCar(cardId?) {
        // console.log(cardId);
        if (cardId && cardId.length === 6) {
            this.baseService.post('getCarInfo', {
                'province_code_id': this.result.a.province_code_id,
                'plate_no': cardId
            })
                .subscribe(hasCarInfo => {
                    if (hasCarInfo.status.succeed === '1') {
                        if (hasCarInfo.data.car_info.car_id) {
                            this.hasCarInfo = hasCarInfo.data.car_info;
                            // this.hasCarInfo.is_modify = '0';
                            this.setCarDetail(this.hasCarInfo);
                        } else {
                            if(this.hasCarInfo.car_id) {
                                this.hasCarInfo = {};
                                this.setCarDetail({
                                    province_code_info: {
                                        province_code_id: this.result.a.province_code_id,
                                        province_code_name: this.result.a.province_code_name
                                    },
                                    plate_no: cardId
                                });
                            }
                        }
                    } else {
                        // this.errorMessage = hasCarInfo.status.error_desc;
                        console.log(hasCarInfo.status.error_desc);
                    }
                }, error => {
                    console.log(error);
                    /*this.errorMessage = <any>error*/
                });
        } else {
            console.log(this.hasCarInfo.car_id);
            if(this.hasCarInfo.car_id){
                this.hasCarInfo = {};
                this.setCarDetail({
                    province_code_info : {
                        province_code_id : this.result.a.province_code_id,
                        province_code_name : this.result.a.province_code_name
                    },
                    plate_no : cardId
                });
            }
        }
    }

    showPanelBox() {
        /*if ( !this.hasCarInfo.car_id ) {
            this.showPanel = !this.showPanel;
        }*/
        this.showPanel = !this.showPanel;
    }


    onItemChange(data: any) {
        console.log('onItemChange', data);
    }

    onItemGroupChange(data: any) {
        console.log('onItemGroupChange', data);
    }

    onItemCancel() {
        console.log('onItemCancel');
    }
}
