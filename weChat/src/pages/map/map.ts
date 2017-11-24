import { NgZone, OnDestroy } from '@angular/core';
/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AqmComponent } from 'angular-qq-maps';

import { RatingComponent, RatingConfig } from 'ngx-weui/rating';

import { TaobaoService } from './tb.service';
import { Observable } from 'rxjs/Rx';

import {MarkersProvider} from '../../providers/http/marker.http';

import {MarkerModel} from '../../models/marker.model';

import { WXSDKService } from '../../providers/wx.sdk.service';
import {BaseProvider} from '../../providers/http/base.http';

declare const qq: any;

@Component({
    selector    : 'app-map',
    templateUrl : './map.html',
    styleUrls   : ['./map.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ TaobaoService, BaseProvider ]
})
export class MapComponent implements OnInit {
    options: any = {};
    status: string = '';
    geoLocation : boolean = false;

    items: Observable<string[]>;
    value: string;

    searchMarkers: any = [];
    markers : any = [];
    currentMarker: any;
    mapMarkers:any = [];

    serviceNumber : number = 0;
    reviewNumber : number = 0;

    isShowPhoneList: boolean = false;

    errorMessage : any;

    customIconsAndClassCog: RatingConfig = {
        cls: 'rating',
        stateOff: 'off',
        stateOn: 'on'
    };

    rate: number = 3;

    readonly: boolean = true;

    // Map
    latitude: number;
    longitude: number;

    // Maker size
    normalSize: any;
    biggerSize: any;
    currentMapMarker: any;

    @ViewChild('map') mapComp: AqmComponent;

    wxs: any;

    constructor(private el: ElementRef, private zone: NgZone, private baseProvider: BaseProvider, private wxService: WXSDKService) {
        this.wxs = this.wxService.init();
        this.wxs.then(res=>{
            this.getLocation();
        });
    }

    ngAfterViewInit() {}

    getLocation() {
        this.wxService.onGetLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                // let speed = res.speed; // 速度，以米/每秒计
                // let accuracy = res.accuracy; // 位置精度
                this.zone.run(() => {
                    this.panTo({
                        lat: this.latitude,
                        lng: this.longitude
                    });
                });
            }
        });
    }

    private map: any;
    onReady(mapNative: any) {
        let latitude = this.latitude || 34.341568;
        let longitude = this.longitude || 108.940175;

        mapNative.setOptions({
            zoom: 12,
            center: new qq.maps.LatLng(latitude, longitude)
        });

        this.map = mapNative;

        //添加监听事件
        qq.maps.event.addListener(this.map, 'click', (event: any) => {
            this.zone.run(() => {
                this.hiddenInfoWindow();
                this.restoreMakerSize();
            });
        });

        //添加监听事件
        qq.maps.event.addListener(this.map, 'dragend', (event: any) => {
            this.zone.run(() => {
                console.log(this.map.getCenter());
            });
        });

        this.normalSize = new qq.maps.Size(40, 46);
        this.biggerSize = new qq.maps.Size(65, 72);

        this.loadMakers({
            latitude : latitude,
            longitude : longitude
        });
    }

    ngOnInit() {
        this.bindEvent();
    }

    loadMakers(options, type?) {
        return this.baseProvider.post('getSiteList', {"filter_info" : {
            "site_name" : options.name || '',
            "region_id" : "",
            "site_category_id" : "",
            "longitude_num" : options.latitude || this.latitude || 34.341568,
            "latitude_num" : options.longitude || this.longitude || 108.94075
        }})
            .subscribe(markers => {
                    this.serviceNumber = 0;
                    this.reviewNumber = 0;
                if (markers.status.succeed) {
                    if(type){
                        this.searchMarkers = markers.data.site_list;
                        this.searchMarkers.forEach(marker=>{
                            // 服务站
                            if (marker.site_category_info.site_category_id === "1") {
                                marker.icon = '/assets/images/marker/service.s.png';
                                marker.type = 'service';
                            }
                            // 监测站
                            if (marker.site_category_info.site_category_id === "2") {
                                marker.icon = '/assets/images/marker/review.s.png';
                                marker.type = 'review';
                            }
                            // this.setMarker(marker);
                        });
                    }
                    this.markers = markers.data.site_list;
                    this.markers.forEach(marker=>{
                        // 服务站
                        if (marker.site_category_info.site_category_id === "1") {
                            marker.icon = '/assets/images/marker/service.s.png';
                            marker.type = 'service';
                            this.serviceNumber ++ ;
                        }
                        // 监测站
                        if (marker.site_category_info.site_category_id === "2") {
                            marker.icon = '/assets/images/marker/review.s.png';
                            marker.type = 'review';
                            this.reviewNumber ++ ;
                        }
                        this.setMarker(marker);
                    });
                } else {
                    this.errorMessage = markers.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    setMarker(marker: any) {
        let aMarker = new qq.maps.Marker({
            position: new qq.maps.LatLng(marker.latitude_num, marker.longitude_num),
            icon : new qq.maps.MarkerImage(marker.icon, this.normalSize, '', '', this.normalSize, ''),
            map: this.map
        });
        aMarker.origin = marker;
        this.mapMarkers.push(aMarker);
        this.bindClickToMaker(aMarker);
    }


    bindClickToMaker(marker: any) {
        qq.maps.event.addListener(marker, 'click', (event)=>{
            this.restoreMakerSize(marker);
            this.showMarker(marker);
            /*marker.setIcon(new qq.maps.MarkerImage(icon, this.biggerSize), '', '', this.biggerSize, '');
            this.zone.run(() => {
                this.showInfoWindow(marker.origin);
            });*/
        });
    }

    showMarker(marker) {
        let icon = marker.origin.icon.replace('.s.png', '.l.png');
        marker.setIcon(new qq.maps.MarkerImage(icon, this.biggerSize), '', '', this.biggerSize, '');
        marker.setZIndex(9);
        this.zone.run(() => {
            this.showInfoWindow(marker.origin);
        });
    }

    restoreMakerSize(mapMarker?) {
        let currentMapMarker = this.currentMapMarker;
        let icon = '';
        if (currentMapMarker) {
            icon = currentMapMarker.origin.icon;
            currentMapMarker.setIcon(new qq.maps.MarkerImage(icon, this.normalSize), '', '', this.normalSize, '');
            currentMapMarker.setZIndex(0);
        }
        this.currentMapMarker = mapMarker;
    }

    getSiteMarkerById(id) {
        let marker: any = {};
        this.mapMarkers.forEach( m=>{
            if (m.origin.site_id === id) {
                marker = m;
            }
        });
        return marker;
    }

    showInfoWindow(marker){
        this.currentMarker = marker;
        this.rate = marker.rank_score;
    }

    hiddenInfoWindow() {
        this.currentMarker = null;
        this.rate = 0;
    }

    bindEvent() {}

    panTo(loc) {
        if(this.map){
            this.map.panTo(new qq.maps.LatLng(loc.lat, loc.lng));
        }
    }

    onSearch(term: string) {
        this.value = term;
        if (term) {
            this.loadMakers({
                name : term
            }, 'search');
        }
    }

    showPhoneList() {
        this.isShowPhoneList = true;
    }

    hiddenPhoneList() {
        this.isShowPhoneList = false;
    }

    onCancel() {
        console.log('onCancel')
    }

    onClear() {
        console.log('onCancel')
    }

    onSubmit(value: string) {
        console.log('onSubmit', value);
    }

    onclickItem(item) {
        let marker = this.getSiteMarkerById(item.site_id);
        this.panTo({
            lat: marker.origin.latitude_num,
            lng: marker.origin.longitude_num
        });
        this.restoreMakerSize(marker);
        this.showMarker(marker);
        this.searchMarkers = [];
        this.value = '';
    }

    ngOnDestroy(): void {
        ['click'].forEach(eventName => {
            if (qq && qq.maps && qq.maps.event) {
                qq.maps.event.clearListeners(this.map, eventName);
            }
        });
    }
}
