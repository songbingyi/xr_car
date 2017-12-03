import {Component, OnInit, ViewEncapsulation, ViewChild, NgZone} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {SkinType, InputType} from 'ngx-weui';
import {DialogService, DialogConfig, DialogComponent} from 'ngx-weui/dialog';
import {PickerData, PickerOptions, PickerService} from 'ngx-weui/picker';

import {PopupComponent} from 'ngx-weui/popup';

import {CustomValidators} from '../../providers/custom.validators';
import {BaseProvider} from '../../providers/http/base.http';

import { WXSDKService } from '../../providers/wx.sdk.service';
import {ImageTypeList} from '../../providers/imageType.service';
import {LocalStorage} from '../../providers/localStorage';

@Component({
    selector      : 'app-review',
    templateUrl   : './review.html',
    styleUrls     : ['./review.scss'],
    encapsulation : ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {

    @ViewChild('ios') iosAS : DialogComponent;
    @ViewChild('full') fullPopup : PopupComponent;

    shouldReservation : Boolean = false;
    shouldReservationBox : Boolean = true;

    isBartrailer : Boolean = false; // 是否是挂车类型

    showDateType : Boolean = false;

     selectedAllBartrailer: boolean = null; // 是否全选了所有挂车的挂箱和挂头 true，还是只选了一个 false

    showBartrailerType : Boolean = false;
    serviceType: any;
    memberDetail : any;
    service_product_info : any;

    config : DialogConfig = <DialogConfig>{
        title   : '返回',
        content : '离开此页面，资料将不会保存，是否离开？',
        cancel  : '是',
        confirm : '否'
    };

    showNext : Boolean = false;

    selectedDate : string;
    selectedBartrailer : any;

    errorMessage : any;
    cities : Array<any>;
    stations : Array<any> = [[{label : '', value : ''}]];
    dates : Array<any>;
    cars : Array<any>;
    bartrailerType : Array<any>;
    price : Number = 0;

    // stationId: 0;

    result : any = {
        city    : {
            valid : true
        },
        station : {
            valid : true
        },
        date    : {
            valid : true
        },
        car     : {
            valid : true
        }
    };

    uploaded : any = {
        a : null
    };

    wx : any;

    constructor(private route : ActivatedRoute, private router : Router, private pickerService : PickerService, private baseService : BaseProvider, private customValidators : CustomValidators, private wxService : WXSDKService, private zone : NgZone, private imageTypeService : ImageTypeList, private localStorage: LocalStorage) {
        this.wx = this.wxService.init();
        this.getInitData();
        this.getCarAndMemberInfo();
        this.imageTypeService.init();
    }

    ngOnInit() {
        let service_type_key = this.route.snapshot.url[0].path;
        this.serviceType = this.localStorage.getObject(service_type_key);
    }

    initUploaded() {
        if (this.isBartrailer) {
            this.uploaded = {
                a : null,
                b : null
            };
        } else {
            this.uploaded = {
                a : null
            };
        }

    }

    getInitData() {
        this.baseService.post('getMemberCarList', {})
            .subscribe(cars => {
                if (cars.status.succeed === '1') {
                    this.cars = cars.data.member_car_list;
                } else {
                    this.errorMessage = cars.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getOpenRegionList', {})
            .subscribe(cities => {
                if (cities.status.succeed === '1') {
                    this.cities = this.groupRegionByPrefix(cities.data.region_list);
                } else {
                    this.errorMessage = cities.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getSiteList', {})
            .subscribe(stations => {
                if (stations.status.succeed === '1') {
                    this.rebuildStation(stations.data.site_list);
                } else {
                    this.errorMessage = stations.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getServiceDateList', {})
            .subscribe(dates => {
                if (dates.status.succeed === '1') {
                    this.dates = dates.data.service_date_list;
                } else {
                    this.errorMessage = dates.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getCarTypeList', {})
            .subscribe(bartrailerType => {
                if (bartrailerType.status.succeed === '1') {
                    this.bartrailerType = bartrailerType.data.car_type_list;
                } else {
                    this.errorMessage = bartrailerType.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        this.baseService.post('getCarTypeListAlter', {})
            .subscribe(bartrailerType => {
                if (bartrailerType.status.succeed === '1') {
                    this.bartrailerType = bartrailerType.data.car_type_list;
                } else {
                    this.errorMessage = bartrailerType.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    rebuildStation(stations) {
        let result = [];
        stations.forEach(station => {
            station.label = station.site_name;
            station.value = station.site_id;
            result.push(station);
        });
        this.stations = [result];
    }

    showStation() {
        this.pickerService.show(this.stations, '', [0], {
            type      : 'default',
            separator : '|',
            cancel    : '取消',
            confirm   : '确定',
            backdrop  : false
        }).subscribe((res : any) => {
            // console.log(res);
            // this.stationId = res.value;
            this.onStationChanged(res.items[0]);
        });
    }

    onStationChanged(station) {
        this.result.station = station;
        this.result.station.valid = true;
        this.validators(this.result);
    }

    getPriceData() {
        this.baseService.post('getServiceProductInfo', {
            'submit_service_product_info' : {
                'service_type_info'         : {
                    'service_type_id'  : this.serviceType.service_type_id,
                    'service_type_key' : this.serviceType.service_type_key
                },
                'region_info'               : {
                    'region_id'   : this.result.city.region_id,
                    'region_name' : this.result.city.region_name
                },
                'driving_license_type_info'               : {
                    'driving_license_type_id'   : '',
                    'driving_license_type_name' : ''
                },
                'member_car_info'           : {
                    'car_id'             : this.result.car.car_id,
                    'province_code_info' : {
                        'province_code_id' : this.result.car.province_code_info.province_code_name,
                        'province_code_name' : this.result.car.province_code_info.province_code_id
                    },
                    'plate_no'           : this.result.car.plate_no
                },
                'site_info'                 : {
                    'site_id'   : this.result.station.site_id,
                    'site_name' : this.result.station.site_name
                },
                'service_date'              : {
                    'service_date_id' : this.result.date.service_date_id,
                    'service_date'    : this.result.date.service_date
                }
            }
        })
            .subscribe(price => {
                if (price.status.succeed === '1') {
                    this.service_product_info = price.data.service_product_info;
                    this.price = price.data.service_product_info.price;
                } else {
                    this.errorMessage = price.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getCarAndMemberInfo() {
        this.baseService.post('getMemberDetail', {
            'member_id' : '1'
        })
            .subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data;
                    this.shouldReservation = this.memberDetail.member_auth_info.member_auth_status === '0';
                    // this.shouldReservationBox = !!this.memberDetail.member_auth_info.member_auth_status;
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    uploadImage(wechat_server_id, type) {
        this.baseService.post('editWeChatImage', {
            'wechat_server_id' : wechat_server_id,
            'image_type'       : this.imageTypeService.getTypeByKey('car_service_type_image')
        })
            .subscribe(image_info => {
                if (image_info.status.succeed === '1') {
                    this.uploaded[type] = image_info.data.image_info.thumb;
                } else {
                    this.errorMessage = image_info.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    confirmOrder() {
        if (this.customValidators.isUploaded(this.uploaded)) {
            this.baseService.post('addServiceOrder', {
                'submit_service_order_info' : {
                    'service_product_info'                    : {
                        'service_product_id'        : this.service_product_info.service_product_id,
                        'service_product_name'      : this.service_product_info.service_product_name,
                        'service_product_entity_id' : this.service_product_info.service_product_entity_id,
                        'price'                     : this.service_product_info.price
                    },
                    'service_order_product_image_upload_list' : this.getUploadedData(),
                    'service_type_info'                       : {
                        'service_type_id'  : this.serviceType.service_type_id,
                        'service_type_key' : this.serviceType.service_type_key
                    },
                    'region_info'                             : {
                        'region_id'   : this.result.city.region_id,
                        'region_name' : this.result.city.region_name
                    },
                    'driving_license_type_info'               : {
                        'driving_license_type_id'   : '',
                        'driving_license_type_name' : ''
                    },
                    'member_car_info'           : {
                        'car_id'             : this.result.car.car_id,
                        'province_code_info' : {
                            'province_code_id' : this.result.car.province_code_info.province_code_name,
                            'province_code_name' : this.result.car.province_code_info.province_code_id
                        },
                        'plate_no'           : this.result.car.plate_no
                    },
                    'site_info'                 : {
                        'site_id'   : this.result.station.site_id,
                        'site_name' : this.result.station.site_name
                    },
                    'service_date'              : {
                        'service_date_id' : this.result.date.service_date_id,
                        'service_date'    : this.result.date.service_date
                    }
                }
            })
                .subscribe(orderResult => {
                    if (orderResult.status.succeed === '1') {
                        this.router.navigate(['/confirmOrder', orderResult.data.service_order_id]);
                    }
                }, error => this.errorMessage = <any>error);
        } else {
            this.errorMessage = '请按照要求上传图片！';
            return false;
        }
    }

    getUploadedData() {
        let uploaded = this.uploaded;
        let tmp = [];
        let image : any = {};
        let sort_order = 0;
        let keys = Object.keys(uploaded).sort();
        let image_type_id = this.imageTypeService.getTypeByKey('service_order_image').image_type_id;
        keys.forEach(key => {
            let upload = uploaded[key];
            image.sort_order = sort_order++;
            image.image_type_id = image_type_id;
            image.image_url = upload;
            tmp.push(image);
        });
        return tmp;
    }

    validators(result) {
        this.errorMessage = '';
        let map = this.customValidators.isValid(result || this.result);
        if (map.valid) {
            this.getPriceData();
        } else {
            this.price = 0;
        }
        return map;
    }

    onTabSelect(event) {
        if (event === false && this.shouldReservationBox) {
            this.shouldReservationBox = false;
            console.log('需要填写信息！');
        }
        return false;
    }

    goToUser() {
        if (this.memberDetail.member_auth_info.identity_auth_status === '0') {
            this.router.navigate(['/userInfo']);
            return;
        }
        if (this.memberDetail.member_auth_info.car_auth_status === '0') {
            this.router.navigate(['/carInfo']);
        }
    }

    goNext() {
        let result = this.result;
        let map = this.validators(result);
        if (!map.valid) {
            this.errorMessage = '所有信息为必填！';
            return;
        }
        this.selectedAllBartrailer = this.result.bartrailer ? this.result.bartrailer.car_type_id === '1' : false;
        this.errorMessage = '';
        this.initUploaded();
        this.showNext = true;
    }

    goPrev(type : SkinType = 'ios', style? : 1) {
        if (this.customValidators.anyUploaded(this.uploaded)) {
            (<DialogComponent>this[`${type}AS`]).show().subscribe((res : any) => {
                // console.log('type', res);
                if (!res.value) {
                    this.errorMessage = '';
                    this.showNext = !this.showNext;
                }
            });
        } else {
            this.errorMessage = '';
            this.showNext = !this.showNext;
        }

        return false;
    }

    onchange($event, item) {
        this.isBartrailer = !!item.car_type_info.has_child;
        if (this.isBartrailer) {
            this.result.bartrailer = {
                valid : true
            };
        } else {
            delete this.result.bartrailer;
        }
        this.result.car = item;
        this.result.car.valid = true;
        this.validators(this.result);
        return false;
    }

    select(item) {
        this.result.city = item;
        this.result.city.valid = true;
        this.validators(this.result);
        this.fullPopup.close();
    }

    showBartrailerTypeBox() {
        this.showBartrailerType = !this.showBartrailerType;
    }

    selectBartrailerType() {
        this.result.bartrailer = this.selectedBartrailer;
        this.result.bartrailer.valid = true;
        this.validators(this.result);
        this.selectedBartrailer = null;
        this.cancelTypeBox();
    }

    showDateTypeBox() {
        this.showDateType = !this.showDateType;
    }

    selectDateType() {
        this.result.date = this.selectedDate;
        this.result.date.valid = true;
        this.validators(this.result);
        this.selectedDate = null;
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.selectedDate = null;
        this.showDateType = false;
        this.selectedBartrailer = null;
        this.showBartrailerType = false;
    }

    choose(type) {
        this.errorMessage = '';
        this.wxService.onChooseImage({
            count      : 1, // 默认9
            sizeType   : ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType : ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success    : (res) => {
                let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                this.upload(localId, type);
            }
        });
    }

    upload(localId, type) {
        this.wxService.onUploadImage({
            localId            : localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips : 1, // 默认为1，显示进度提示
            success            : (res) => {
                this.zone.run(() => {
                    let serverId = res.serverId; // 返回图片的服务器端ID
                    this.uploadImage(serverId, type);
                });
            }
        });
    }

    /*confirmOrder() {
        if (this.customValidators.isUploaded(this.uploaded)) {
            this.router.navigate(['/confirmOrder', 1]);
        } else {
            this.errorMessage = '请按照要求上传图片！';
            return false;
        }
    }*/

    groupRegionByPrefix(regions): any {
        let tmp = {};
        regions.forEach(region => {
            if (tmp[region.prefix_name]) {
                tmp[region.prefix_name].push(region);
            } else {
                tmp[region.prefix_name] = [];
                tmp[region.prefix_name].push(region);
            }
        });
        return tmp;
    }

    goToAnchor(location: string): void {
        window.location.hash = location;
    }
}
