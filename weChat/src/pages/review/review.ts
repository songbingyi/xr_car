import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SkinType, InputType } from 'ngx-weui';
import { DialogService, DialogConfig, DialogComponent } from 'ngx-weui/dialog';

import { PopupComponent } from 'ngx-weui/popup';

import { CustomValidators } from '../../providers/custom.validators';
import { BaseProvider } from '../../providers/http/base.http';

@Component({
  selector: 'app-review',
  templateUrl: './review.html',
  styleUrls: ['./review.scss'],
    encapsulation : ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {

    @ViewChild('ios') iosAS: DialogComponent;
    @ViewChild('full') fullPopup: PopupComponent;

    shouldReservation: Boolean = false;
    shouldReservationBox: Boolean = true;

    isBartrailer : Boolean = false;

    showDateType: Boolean = false;

    showBartrailerType: Boolean = false;

    private config: DialogConfig = <DialogConfig>{
        title: '返回',
        content: '离开此页面，资料将不会保存，是否离开？',
        cancel: '是',
        confirm: '否'
    };

    showNext : Boolean = false;

    selectedDate : string;
    selectedBartrailer : any;


    errMsg: any;
    cities: Array<any>;
    stations: Array<any> = [[{label: '', value: ''}]];
    dates: Array<any>;
    cars: Array<any>;
    bartrailerType: Array<any>;

    stationId: 0;

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

    constructor(private router : Router, private baseService: BaseProvider, private customValidators: CustomValidators) {
        this.getInitData();
    }

    ngOnInit() {
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
        this.baseService.get('bartrailer.type.mock.json')
            .subscribe(bartrailerType => {
                this.bartrailerType = bartrailerType;
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

    filterStation() {
        let id = this.stationId;
        let stations = this.stations[0];
        let len = stations.length;
        for (let i = 0; i < len; i ++) {
            if (stations[i].id === id) {
                return stations[i];
            }
        }
    }

    onTabSelect(event) {
        // console.log(event);
        if (event === false) {
            this.shouldReservationBox = false;
            console.log('需要填写信息！');
        }
        return false;
    }

    onShow(type: SkinType = 'ios', style: 1) {
        (<DialogComponent>this[`${type}AS`]).show().subscribe((res: any) => {
            // console.log('type', res);
            if (!res.value) {
                // this.location.back();
                this.showNext = !this.showNext;
            }
        });

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
        console.log(this.result);
        this.showNext = true;
    }

    onStationChanged() {
        this.result.station = this.filterStation();
        this.result.station.valid = true;
        this.customValidators.isValid(this.result);
    }

    onchange($event, item) {
        this.isBartrailer = item.carType === 3;
        if (this.isBartrailer) {
            this.result.bartrailer = {
                valid : true
            };
        }else {
            delete this.result.bartrailer;
        }
        this.result.car = item;
        this.result.car.valid = true;
        this.customValidators.isValid(this.result);
        return false;
    }

    select(item) {
        this.result.city = item;
        this.result.city.valid = true;
        this.customValidators.isValid(this.result);
        this.fullPopup.close();
    }

    showBartrailerTypeBox() {
        this.showBartrailerType = !this.showBartrailerType;
    }

    selectBartrailerType() {
        this.result.bartrailer = this.selectedBartrailer;
        this.result.bartrailer.valid = true;
        this.customValidators.isValid(this.result);
        this.selectedBartrailer = null;
        this.cancelTypeBox();
    }

    showDateTypeBox() {
        this.showDateType = !this.showDateType;
    }

    selectDateType() {
        this.result.date = this.selectedDate;
        this.selectedDate = null;
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.selectedDate = null;
        this.showDateType = false;
        this.selectedBartrailer = null;
        this.showBartrailerType = false;
    }



}
