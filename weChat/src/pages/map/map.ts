import { NgZone, OnDestroy } from '@angular/core';
/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AqmComponent } from 'angular-qq-maps';

import { RatingComponent, RatingConfig } from 'ngx-weui/rating';

import { TaobaoService } from "./tb.service";
import { Observable } from 'rxjs/Rx';

import {MarkersProvider} from '../../providers/http/marker.http';

import {MarkerModel} from "../../models/marker.model";

import { WXSDKService } from '../../providers/wx.sdk.service';

declare const qq: any;

@Component({
    selector    : 'app-map',
    templateUrl : './map.html',
    styleUrls   : ['./map.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ TaobaoService, MarkersProvider ]
})
export class MapComponent implements OnInit {
    options: any = {};
    status: string = '';
    geoLocation : boolean = false;

    items: Observable<string[]>;
    value: string;

    markers : MarkerModel[] = [];
    currentMarker: MarkerModel;

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

    constructor(private el: ElementRef, private zone: NgZone, private tbService: TaobaoService, private markerService: MarkersProvider, private wxService: WXSDKService) {
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

        this.normalSize = new qq.maps.Size(40, 46);
        this.biggerSize = new qq.maps.Size(65, 72);

        this.loadMakers();
    }

    ngOnInit() {
        this.bindEvent();
    }

    loadMakers() {
        this.markerService.getMakers('marker.mock.json')
            .subscribe(markers => {
                this.markers = markers;
                markers.forEach(marker=>{
                    this.setMarker(marker);
                })
            },
            error => this.errorMessage = <any>error
        );
    }

    setMarker(marker: MarkerModel) {
        let aMarker = new qq.maps.Marker({
            position: new qq.maps.LatLng(marker.lat, marker.lng),
            icon : new qq.maps.MarkerImage(marker.icon, this.normalSize, '', '', this.normalSize, ''),
            map: this.map
        });
        aMarker.origin = marker;
        this.bindClickToMaker(aMarker);
    }


    bindClickToMaker(marker: any) {
        qq.maps.event.addListener(marker, 'click', (event)=>{
            let icon = marker.origin.icon.replace('.s.png', '.l.png');
            this.restoreMakerSize(marker);
            marker.setIcon(new qq.maps.MarkerImage(icon, this.biggerSize), '', '', this.biggerSize, '');
            this.zone.run(() => {
                this.showInfoWindow(marker.origin);
            });
        });
    }

    restoreMakerSize(mapMarker?) {
        let currentMapMarker = this.currentMapMarker;
        let icon = '';
        if (currentMapMarker) {
            icon = currentMapMarker.origin.icon;
            currentMapMarker.setIcon(new qq.maps.MarkerImage(icon, this.normalSize), '', '', this.normalSize, '');
        }
        this.currentMapMarker = mapMarker;
    }

    showInfoWindow(marker){
        this.currentMarker = marker;
        this.rate = marker.star;
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
            this.items = this.tbService.search(term);
        }
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
        console.log(item);
    }
}
