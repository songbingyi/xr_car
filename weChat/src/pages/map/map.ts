import {NgZone, OnDestroy} from '@angular/core';
/* tslint:disable */
import {Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {AqmComponent} from 'angular-qq-maps';

import {RatingComponent, RatingConfig} from 'ngx-weui/rating';

// import { TaobaoService } from './tb.service';
import {Observable} from 'rxjs/Rx';

import {MarkersProvider} from '../../providers/http/marker.http';

import {MarkerModel} from '../../models/marker.model';

import {WXSDKService} from '../../providers/wx.sdk.service';
import {BaseProvider} from '../../providers/http/base.http';

import {DistancePipe} from '../../pipes/distance';

declare const qq: any;
declare var AMap;

@Component({
    selector: 'app-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [BaseProvider]
})
export class MapComponent implements OnInit {

    isShowPhoneList: boolean = false;

    errorMessage: any;

    isLoaded:Boolean = false;

    currentMarker: any;
    markers: any = [];
    value: string;

    // 地图对象
    map: any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    pagination = {
        page: 1,
        count: 100
    };

    // 默认地图缩放级别，最小地图缩放级别
    zoom: number = 10;
    zoomMin: number = 4;

    constructor(private el: ElementRef, private zone: NgZone, private baseProvider: BaseProvider) {
    }

    ngOnInit() {

    }

    ngAfterContentInit() {
        /*let map = new AMap.Map('gaoDeMap', {
            resizeEnable: true,
            center: [this.longitude, this.latitude],
            zoom: this.zoom,
            dragEnable: true
        });

        AMap.plugin(['AMap.ToolBar'], function () {
            map.addControl(new AMap.ToolBar());
        });

        map.on('click', function (e) {
            console.log(e);
        })*/
    }

    refreshSite() {
        /*this.getLocation((lat, lng)=>{
            this.loadMakers({latitude: lat, longitude: lng});
        });*/
    }

    showPhoneList() {
        this.isShowPhoneList = true;
    }

    hiddenPhoneList() {
        this.isShowPhoneList = false;
    }


    onSearch(term: string) {
        //console.log("Search");
        /*this.value = term;
        if (term) {
            this.loadMarkersBySearch({
                name: term
            });
        }*/
    }

    onClick() {
        // console.log('onClick');
        // this.restoreMakerSize();
        // this.hiddenInfoWindow();
    }

    onCancel() {
        // console.log('onCancel');
    }

    onClear() {
        // console.log('onCancel');
    }

    onSubmit(value: string) {
        // console.log('onSubmit', value);
    }

    onclickItem(item) {
        /*let marker = this.getSiteMarkerById(item.site_id);
        // console.log(item);
        // console.log(marker);
        if(!marker.origin){
            marker = this.setMarker(item);
        }
        this.panTo({
            lat: marker.origin.latitude_num,
            lng: marker.origin.longitude_num
        });
        this.restoreMakerSize(marker);
        this.showMarker(marker);
        this.searchMarkers = [];
        this.value = '';*/
    }


}
