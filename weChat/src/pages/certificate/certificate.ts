import {Component, OnInit, ViewEncapsulation, ViewChild, NgZone} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import { SkinType, InputType } from 'ngx-weui';
import { DialogService, DialogConfig, DialogComponent } from 'ngx-weui/dialog';
import { PickerData, PickerOptions, PickerService } from 'ngx-weui/picker';

import { PopupComponent } from 'ngx-weui/popup';

import { CustomValidators } from '../../providers/custom.validators';
import { BaseProvider } from '../../providers/http/base.http';

import { WXService } from '../../providers/wx.service';

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

    showNext : Boolean = false;

    selectedDate : string;

    private config: DialogConfig = <DialogConfig>{
        title: '返回',
        content: '离开此页面，资料将不会保存，是否离开？',
        cancel: '是',
        confirm: '否'
    };

    errMsg: any;
    cities: Array<any>;
    stations: Array<any> = [[{label: '', value: ''}]];
    dates: Array<any>;
    cars: Array<any>;

    // stationId: 0;

    result : any = {
        city     : {
            valid: true
        },
        station  : {
            valid: true
        },
        date     : {
            valid: true
        },
        car : {
            valid: true
        }
    };

    uploaded: any = {
        a: null,
        b: null
    };

    wx: any;

    constructor(private router : Router, private pickerService: PickerService, private baseService: BaseProvider, private customValidators: CustomValidators, private wxService: WXService, private zone: NgZone) {
        this.wx = this.wxService.config({});
        this.getInitData();
    }

    ngOnInit() {
    }

    initUploaded() {
        this.uploaded = {
            a: null,
            b: null
        };
    }

    getInitData() {
        this.baseService.get('cars.mock.json')
            .subscribe(cars => {
                this.cars = cars;
            }, error => this.errMsg = <any>error);
        this.baseService.get('city.mock.json')
            .subscribe(cities => {
                this.cities = cities;
            }, error => this.errMsg = <any>error);
        this.baseService.get('marker.mock.json')
            .subscribe(stations => {
                this.rebuildStation(stations);
            }, error => this.errMsg = <any>error);
        this.baseService.get('date.mock.json')
            .subscribe(dates => {
                this.dates = dates;
            }, error => this.errMsg = <any>error);
    }

    rebuildStation(stations) {
        let result = [];
        stations.forEach(station => {
            station.label = station.name;
            station.value = station.id;
            result.push(station);
        });
        this.stations =  [result];
    }

    showStation() {
        this.pickerService.show(this.stations, '', [0], {
            type: 'default',
            separator: '|',
            cancel: '取消',
            confirm: '确定',
            backdrop: false
        }).subscribe((res: any) => {
            // console.log(res);
            // this.stationId = res.value;
            this.onStationChanged(res.items[0]);
        });
    }

    onStationChanged(station) {
        this.result.station = station; // this.filterStation();
        this.result.station.valid = true;
        this.validators(this.result);
    }

    /*filterStation() {
        console.log('stationId' + this.stationId);
        let id = this.stationId;
        let stations = this.stations[0];
        let len = stations.length;
        for (let i = 0; i < len; i ++) {
            if (stations[i].id === id) {
                return stations[i];
            }
        }
    }*/

    validators(result) {
        this.errMsg = '';
        return this.customValidators.isValid( result || this.result);
    }

    onTabSelect(event) {
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
        let map = this.validators(result);
        if (!map.valid) {
            this.errMsg = '所有信息为必填！';
            return;
        }
        this.errMsg = '';
        this.initUploaded();
        this.showNext = true;
    }

    goPrev(type: SkinType = 'ios', style: 1) {
        if (this.customValidators.anyUploaded(this.uploaded)) {
            (<DialogComponent>this[`${type}AS`]).show().subscribe((res : any) => {
                // console.log('type', res);
                if (!res.value) {
                    this.errMsg = '';
                    this.showNext = !this.showNext;
                }
            });
        } else {
            this.errMsg = '';
            this.showNext = !this.showNext;
        }

        return false;
    }

    onchange($event, item) {
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
    }

    choose(type) {
        this.errMsg = '';
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
            this.errMsg = '请按照要求上传图片！';
            return false;
        }
    }

}
