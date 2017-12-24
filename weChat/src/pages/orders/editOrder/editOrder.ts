import {Component, NgZone, OnInit} from '@angular/core';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

import {WXSDKService} from '../../../providers/wx.sdk.service';
import {ImageTypeList} from '../../../providers/imageType.service';
import {CustomValidators} from '../../../providers/custom.validators';

@Component({
    selector    : 'app-edit-order',
    templateUrl : './editOrder.html',
    styleUrls   : ['./editOrder.scss']
})
export class EditOrderComponent implements OnInit {

    mode : String = 'cert';
    errorMessage : any;
    detail : any;
    isLoaded : Boolean = false;

    dates : any = [];

    showDateType : Boolean = false;

    selectedDate : any;

    uploadedIndex : any = {
        a : 0,
        b : 1,
        c : 2,
        d : 3
    };

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

    service_product_info : any;
    price : Number = 0;

    wx : any;

    constructor(private route : ActivatedRoute, private router : Router, private baseService : BaseProvider, private wxService : WXSDKService, private zone : NgZone, private imageTypeService : ImageTypeList, private customValidators : CustomValidators) {
        this.wx = this.wxService.init();
        this.imageTypeService.init();
    }

    ngOnInit() {
        let id : string = this.route.snapshot.paramMap.get('id');
        this.getInitData(id);
    }

    /*initUploaded() {
        let key = this.detail.service_order_product_info.service_type_info.service_type_key;

        if (key === 'service_driving_license') { // 驾照
            this.uploaded = {
                a : null,
                b : null,
                c : null,
                d : null
            };
        }
        if (key === 'service_operation_certificate') { // 运营证
            this.uploaded = {
                a : null,
                b : null
            };
        }
        if (key === 'service_audit_car') { // 车辆
            if (this.detail.service_order_product_info.service_order_product_image_list.length === 1) { // 挂箱 或者 挂头
                this.uploaded = {
                    a : null
                };
            } else {
                this.uploaded = { // 挂箱和挂头
                    a : null,
                    b : null
                };
            }
        }
    }*/

    getInitData(id?) {
        this.isLoaded = false;
        this.baseService.post('getServiceOrderDetail', {
            'service_order_id' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                    this.detail.service_order_status_info.service_order_status_id = '32'
                    // this.detail.service_order_status_info.service_order_status_id = '22';
                    // this.initUploaded();
                } else {
                    this.errorMessage = detail.status.error_desc;
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
    }

    getPriceData() {
        this.baseService.post('getServiceProductInfo', {
            'submit_service_product_info' : {
                'service_type_info'         : {
                    'service_type_id'  : this.detail.service_order_product_info.service_type_info.service_type_id,
                    'service_type_key' : this.detail.service_order_product_info.service_type_info.service_type_key
                },
                'region_info'               : {
                    'region_id'   : this.result.city.region_id,
                    'region_name' : this.result.city.region_name
                },
                'driving_license_type_info' : {
                    'driving_license_type_id'   : '',
                    'driving_license_type_name' : ''
                },
                'member_car_info'           : {
                    'car_id'             : this.result.car.car_id,
                    'province_code_info' : {
                        'province_code_id'   : this.result.car.province_code_info.province_code_name,
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

    uploadImage(wechat_server_id, type) {
        this.baseService.post('editWeChatImage', {
            'wechat_server_id' : wechat_server_id,
            'image_type'       : this.imageTypeService.getTypeByKey('car_service_type_image')
        })
            .subscribe(image_info => {
                if (image_info.status.succeed === '1') {
                    // this.uploaded[type] = image_info.data.image_info.thumb;
                    let image = image_info.data.image_info.source || image_info.data.image_info.thumb;
                        this.setPictureToList(type, image);
                } else {
                    this.errorMessage = image_info.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    setPictureToList(type, url) {
        let index = this.uploadedIndex[type];
        this.detail.service_order_product_info.service_order_product_image_list[index].thumb = url;
    }

    /*confirmOrder() {
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
                        'service_type_id'  : this.detail.service_order_product_info.service_type_info.service_type_id,
                        'service_type_key' : this.detail.service_order_product_info.service_type_info.service_type_key
                    },
                    'region_info'                             : {
                        'region_id'   : this.result.city.region_id,
                        'region_name' : this.result.city.region_name
                    },
                    'driving_license_type_info'               : {
                        'driving_license_type_id'   : '',
                        'driving_license_type_name' : ''
                    },
                    'member_car_info'                         : {
                        'car_id'             : this.result.car.car_id,
                        'province_code_info' : {
                            'province_code_id'   : this.result.car.province_code_info.province_code_name,
                            'province_code_name' : this.result.car.province_code_info.province_code_id
                        },
                        'plate_no'           : this.result.car.plate_no
                    },
                    'site_info'                               : {
                        'site_id'   : this.result.station.site_id,
                        'site_name' : this.result.station.site_name
                    },
                    'service_date'                            : {
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
    }*/

    getUploadedData() {
        let images = this.detail.service_order_product_info.service_order_product_image_list;
        // let uploaded = this.uploaded;
        let tmp = [];
        let image : any = {};
        // let sort_order = 0;
        // let keys = Object.keys(uploaded).sort();
        let image_type_id = this.imageTypeService.getTypeByKey('service_order_image').image_type_id;

        images.forEach((picture, index ) => {
            // let upload = uploaded[key];
            image.sort_order = index;
            image.image_type_id = image_type_id;
            image.image_url = picture.thumb;
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


    /**
     * "操作类型
     * 1-付款
     * 2-修改订单
     * 3-删除订单 就是取消
     * 4-申请退款"
     */
    // 修改
    editOrder(id) {
        if( !this.result.date.service_date_id && this.detail.service_order_status_info.service_order_status_id==='32' ) {
            this.errorMessage = '请选择审验时间！';
            return;
        }
        this.operation(id, 2);
    }


    operation(id, operation) {
        this.baseService.post('editServiceOrder', {
            'submit_service_order_info' : {
                'service_order_id'                        : id,
                'service_order_product_image_upload_list' : this.getUploadedData(),
                'service_date'                            : {
                    'service_date_id' : this.result.date.service_date_id,
                    'service_date'    : this.result.date.service_date
                }
            }
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                    this.router.navigate(['/orderDetail', id]);
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    changeMode(type) {
        this.mode = type;
    }

    getServiceProductSpecTypeInfoByKey(key) {
        let detail = this.detail;
        let productSpecTypes = (detail && detail.service_order_product_info) ? detail.service_order_product_info.service_order_product_extend_list : [];
        let length = productSpecTypes.length;
        for (let i = 0; i < length; i++) {
            let productSpecType = productSpecTypes[i];
            if (productSpecType.service_product_spec_type_info.service_product_spec_type_key === key) {
                return productSpecType || {};
            }
        }
        return {};
    }

    showDateTypeBox() {
        this.showDateType = !this.showDateType;
    }

    selectDateType() {
        this.result.date = this.selectedDate;
        // this.result.date.valid = true;
        // this.validators(this.result);
        // this.selectedDate = null;
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        // this.selectedDate = null;
        this.showDateType = false;
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

}
