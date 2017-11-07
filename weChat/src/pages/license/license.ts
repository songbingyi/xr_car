import {Component, OnInit, ViewEncapsulation, ViewChild, NgZone} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {Location} from '@angular/common';

import { Observable } from 'rxjs/Rx';

import { SkinType, InputType } from 'ngx-weui';
import { DialogService, DialogConfig, DialogComponent } from 'ngx-weui/dialog';
import { ToastService } from 'ngx-weui/toast';
import { PopupComponent } from 'ngx-weui/popup';

import { CustomValidators } from '../../providers/custom.validators';
import { BaseProvider } from '../../providers/http/base.http';

import { WXSDKService } from '../../providers/wx.sdk.service';

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

    errorMessage: any;
    cities: Array<any>;
    licenses: Array<any>;

    result : any = {
        city: {
            valid: true
        },
        licenseType: {
            valid: true
        }
    };

    uploaded: any = {
        a: null,
        b: null,
        c: null,
        d: null
    };

    selectedLicense: any = null;

    private config: DialogConfig = <DialogConfig>{
        title: '返回',
        content: '离开此页面，资料将不会保存，是否离开？',
        cancel: '是',
        confirm: '否'
    };

    showNext: Boolean = false;

    wx: any;

    constructor(private router: Router, private location: Location, private baseService: BaseProvider, private customValidators: CustomValidators, private wxService: WXSDKService, private zone: NgZone) {
        this.wx = this.wxService.init();
        this.getInitData();
    }

    ngOnInit() {
    }

    initUploaded() {
        this.uploaded = {
            a: null,
            b: null,
            c: null,
            d: null
        };
    }

    getInitData() {
        this.baseService.get('getOpenRegionList')
            .subscribe(cities => {
                if (cities.status.succeed) {
                    this.cities = this.groupRegionByPrefix(cities.data);
                } else {
                    this.errorMessage = cities.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
        this.baseService.get('getDrivingLicenseTypeList')
            .subscribe(licenses => {
                if (licenses.status.succeed) {
                    this.licenses = licenses.data;
                } else {
                    this.errorMessage = licenses.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    onTabSelect(event) {
        // console.log(event);
        if (event === false) {
            this.shouldReservationBox = false;
            console.log('需要填写信息！');
        }
        return false;
    }

    goToUser() {
        this.router.navigate(['/userInfo']);
    }

    goNext() {
        let result = this.result;
        let map = this.customValidators.isValid(result);
        if (!map.valid) {
            return;
        }
        this.initUploaded();
        this.showNext = true;
    }

    goPrev(type: SkinType = 'ios', style: 1) {
        if (this.customValidators.anyUploaded(this.uploaded)) {
            (<DialogComponent>this[`${type}AS`]).show().subscribe((res: any) => {
                console.log('type', res);
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

    select(item) {
        this.result.city = item;
        this.result.city.valid = true;
        this.customValidators.isValid(this.result);
        this.fullPopup.close();
    }

    showLicenseTypeBox() {
        this.showLicenseType = !this.showLicenseType;
    }


    selectLicenseType() {
        this.result.licenseType = this.selectedLicense;
        this.result.licenseType.valid = true;
        this.customValidators.isValid(this.result);
        this.selectedLicense = null;
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.showLicenseType = false;
    }

    choose(type) {
        this.errorMessage = '';
        this.wxService.onChooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                this.upload(localId, type);
            }
        });
    }

    upload(localId, type) {
        this.wxService.onUploadImage({
            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: (res) => {
                this.zone.run(() => {
                    let serverId = res.serverId; // 返回图片的服务器端ID
                    this.uploaded[type] = localId;
                });
            }
        });
    }

    confirmOrder() {
        if (this.customValidators.isUploaded(this.uploaded)) {
            this.router.navigate(['/confirmOrder', 1]);
        } else {
            this.errorMessage = '请按照要求上传图片！';
            return false;
        }
    }

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

}
