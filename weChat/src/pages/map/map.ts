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

    options: any = {};
    status: string = '';
    loading: boolean = false;

    @ViewChild('map') mapComp: AqmComponent;

    distanceMax: number = 800000;
    distance : Number = 5000;

    isShowPhoneList: boolean = false;

    errorMessage: any;

    isLoaded:Boolean = false;

    searchMarkers: any = [];
    currentMarker: any;
    currentMarkerExtra:any;
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

    customIconsAndClassCog: RatingConfig = {
        cls: 'rating',
        stateOff: 'off',
        stateOn: 'on'
    };

    rate: number = 3;

    serviceNumber:number = 0;
    reviewNumber:number = 0;

    // 默认地图缩放级别，最小地图缩放级别
    zoom: number = 10;
    zoomMin: number = 4;

    wxs: any;

    // Maker size
    normalSize: any;
    biggerSize: any;
    currentMapMarker: any;
    mapMarkers:any = [];

    constructor(private el: ElementRef, private zone: NgZone, private baseProvider: BaseProvider, private wxService: WXSDKService) {
        this.wxs = this.wxService.init();
    }

    ngOnInit() {
        this.onReady();
    }

    getLocation(callback?) {
        this.wxService.onGetLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                if( callback ){
                    callback(this.latitude, this.longitude);
                }
                this.onReady();

            }
        });
    }

    ngAfterContentInit(){
        this.wxs.then(res => {
            this.getLocation();
        });
    }

    onReady() {
        let map = new AMap.Map('gaoDeMap', {
            resizeEnable: true
        });

        AMap.plugin(['AMap.ToolBar'], () => {
            map.addControl(new AMap.ToolBar({
                offset: new AMap.Pixel(0,40),
                position:'LT'
            }));
        });

        /*map.on('click',(e)=>{
            console.log(e);
        });*/

        //添加监听事件
        AMap.event.addListener(map, 'touchend', (event: any) => {
            this.zone.run(() => {
                this.hiddenInfoWindow();
                this.restoreMakerSize();
            });
        });

        // this.getDistance();

        /*AMap.event.addListener(map, 'zoomend', (event: any) => {
            //this.getDistance();
            this.zone.run(() => {
                // this.distance = distance;
                this.loadMakers({});
            });
        });*/

        //添加监听事件
        /*AMap.event.addListener(map, 'dragend', (event: any) => {
            this.zone.run(() => {
                // console.log(this.map.getCenter());
            });
        });*/

        this.normalSize = new AMap.Size(40, 46);
        this.biggerSize = new AMap.Size(65, 72);

        this.loadMakers({
            latitude: this.latitude,
            longitude: this.longitude
        });

        this.map = map;
    }

    loadMarkersBySearch(options) {
        this.searchMarkers = [];
        this.loading = true;
        return this.baseProvider.post('getSiteList', {
            'filter_info': {
                'site_name': options.name || '',
                'region_id': '',
                'site_category_id': '',
                'latitude_num': options.latitude || this.latitude || 34.341568,
                'longitude_num': options.longitude || this.longitude || 108.94075,
                'distance': '200000' //this.distance
            },
            'pagination': this.pagination
        }).subscribe(markers => {
                if (markers.status.succeed === '1') {
                    //this.isLoaded = true;
                    this.loading = false;
                    this.searchMarkers = markers.data.site_list;
                    this.searchMarkers.forEach(marker => {
                        // 服务站
                        if (marker.site_category_info.site_category_id === '1') {
                            marker.icon = '/assets/images/marker/service.png';
                            marker.type = 'service';
                        }
                        // 监测站
                        if (marker.site_category_info.site_category_id === '2') {
                            marker.icon = '/assets/images/marker/review.png';
                            marker.type = 'review';
                        }
                        // this.setMarker(marker);
                    });
                } else {
                    this.errorMessage = markers.status.error_desc;
                    this.loading = false;
                }
            }, error => {
                this.errorMessage = <any>error;
                this.loading = false;
            }
        );
    }


    loadMakers(options) {
        this.isLoaded = false;
        return this.baseProvider.post('getSiteList', {
            'filter_info': {
                'site_name': options.name || '',
                'region_id': '',
                'site_category_id': '',
                'latitude_num': options.latitude || this.latitude || 34.341568,
                'longitude_num': options.longitude || this.longitude || 108.94075,
                'distance': this.distance
            },
            'pagination': this.pagination
        }).subscribe(markers => {
                if (markers.status.succeed === '1') {
                    if (markers.data && markers.data.site_list && markers.data.site_list.length === 0) {
                        this.zoomOut();
                        return ;
                    }
                    this.isLoaded = true;
                    this.serviceNumber = 0;
                    this.reviewNumber  = 0;
                    this.markers = markers.data.site_list;
                    this.markers.forEach(marker => {
                        // 服务站
                        if (marker.site_category_info.site_category_id === '1') {
                            marker.icon = '/assets/images/marker/service.png';
                            marker.type = 'service';
                            this.serviceNumber++;
                        }
                        // 监测站
                        if (marker.site_category_info.site_category_id === '2') {
                            marker.icon = '/assets/images/marker/review.png';
                            marker.type = 'review';
                            this.reviewNumber++;
                        }
                        this.setMarker(marker);
                    });
                    this.zone.run(()=>{
                        //this.serviceNumber = parseInt(this.serviceNumber + '', 10);
                        //this.reviewNumber = parseInt(this.reviewNumber + '', 10);
                    });
                } else {
                    this.errorMessage = markers.status.error_desc;
                    //this.loading = false;
                }
            }, error => {
                this.errorMessage = <any>error;
                //this.loading = false;
            }
        );
    }

    zoomOut() {
        if((this.zoom >= this.zoomMin) && (this.distance < this.distanceMax)){
            this.zoom --;
            this.map.setZoom(this.zoom);
        }
    }

    setMarker(marker: any) {
        let aMarker = new AMap.Marker({
            position: new AMap.LngLat(marker.longitude_num, marker.latitude_num),
            icon: new AMap.Icon({size:this.normalSize, image:marker.icon, imageSize:this.normalSize}), //marker.icon, this.normalSize, '', '', this.normalSize, ''
            map: this.map,
            clickable: true,
            topWhenClick: true,
            extData : marker,
            offset : new AMap.Pixel(-20, -46)
        });
        this.mapMarkers.push(aMarker);
        this.bindClickToMaker(aMarker);
        return aMarker;
    }

    bindClickToMaker(aMarker: any) {
        let marker = aMarker.getExtData();
        AMap.event.addListener(aMarker, 'click', (event) => {
            this.restoreMakerSize(aMarker);
            this.showMarker(aMarker);
            // aMarker.setIcon(new AMap.Icon({size:this.biggerSize, imageOffset:new AMap.Pixel(0, 0), image:marker.icon, imageSize:this.biggerSize}));
            //marker.setIcon(new qq.maps.MarkerImage(icon, this.biggerSize), '', '', this.biggerSize, '');
        });
    }

    showMarker(aMarker, index?) {
        let marker = aMarker.getExtData();
        let icon = marker.icon.replace('.png', '.big.png');
        // marker.setIcon('/assets/images/marker/blank.png');
        // console.log(marker.getIcon());
        // marker.setIcon(new qq.maps.MarkerImage('/assets/images/marker/blank.png', this.biggerSize, '', '', this.biggerSize, ''))
        // console.log(marker.getIcon());
        // marker.setIcon(new AMap.Icon(icon, this.biggerSize), '', '', this.biggerSize, '');
        // marker.setZIndex(9);
        aMarker.setIcon(new AMap.Icon({size:this.biggerSize, imageOffset:new AMap.Pixel(0, 0), image:icon, imageSize:this.biggerSize}));
        aMarker.setOffset(new AMap.Pixel(-32.5, -72));
        this.zone.run(() => {
            this.showInfoWindow(aMarker);
        });
    }

    restoreMakerSize(mapMarker?) {
        let currentMapMarker = this.currentMapMarker;
        let icon = '';
        if (currentMapMarker) {
            icon = currentMapMarker.getExtData().icon;
            // currentMapMarker.setIcon(this.theNullMarker);
            //currentMapMarker.setIcon(new qq.maps.MarkerImage(icon, this.normalSize), this.normalSize, '', this.normalSize, '');
            currentMapMarker.setIcon(new AMap.Icon({size:this.normalSize, image:icon, imageSize:this.normalSize}));
            currentMapMarker.setOffset(new AMap.Pixel(-20, -46));
            currentMapMarker.setzIndex(0);
        }
        this.currentMapMarker = mapMarker;
    }

    getSiteMarkerById(id) {
        let marker: any = {};
        this.mapMarkers.forEach(m => {
            if (m.getExtData().site_id === id) {
                marker = m;
            }
        });
        return marker;
    }

    showInfoWindow(marker) {
        this.currentMarker = marker;
        this.currentMarkerExtra = marker.getExtData();
        this.rate = marker.rank_score;
    }

    hiddenInfoWindow() {
        this.currentMarker = null;
        this.currentMarkerExtra = null;
        this.rate = 0;
    }

    panTo(LngLat) {
        let newLngLat = new AMap.LngLat(LngLat.lng, LngLat.lat);
        this.map.panTo(newLngLat);
    }

    mapNotify() {
        let distance = new DistancePipe();
        let serviceNumber = this.serviceNumber;
        let reviewNumber = this.reviewNumber;
        let string = '';
        if(serviceNumber){
            string = this.serviceNumber+'个服务站';
        }
        if(reviewNumber){
            string = this.reviewNumber+'个检测站';
        }
        if(serviceNumber && reviewNumber){
            string = this.serviceNumber+'个服务站，' + this.reviewNumber+'个检测站';
        }
        let distanceString = distance.transform(this.distance);
        if(distanceString){
            return '方圆' + distanceString + '共找到' + string;
        }else{
            return '处理中...';
        }

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


    onSearch(term: any) {
        // console.log("Search");
        // console.log(term);
        if(typeof term === 'string'){
            this.value = term;
        }else{
            this.value = term.target.value;
        }
        let value = this.value;
        // console.log(value);
        if (value) {
            this.loadMarkersBySearch({
                name: value
            });
        }
    }

    onClick() {
        // console.log('onClick');
        this.restoreMakerSize();
        this.hiddenInfoWindow();
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
        let marker = this.getSiteMarkerById(item.site_id);
        // console.log(item);
        // console.log(marker);
        let hasExtData = marker.getExtData;
        if(!hasExtData || (hasExtData && !marker.getExtData().site_id)){
            marker = this.setMarker(item);
        }
        this.panTo({
            lat: marker.getExtData().latitude_num,
            lng: marker.getExtData().longitude_num
        });
        this.restoreMakerSize(marker);
        this.showMarker(marker);
        this.searchMarkers = [];
        this.value = '';
    }


}
