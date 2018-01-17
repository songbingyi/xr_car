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
let windowMap: any;

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
    loading: Boolean = false;
    geoLocation: boolean = false;
    // distances : any = [5000, 10000, 15000, 20000];
    // distanceIndex : any = 0;
    // distance : Number = this.distances[this.distanceIndex];
    distanceMax: number = 800000;
    distance : Number = 5000;

    theNullMarker: any;
    circleMarker : any;

    items: Observable<string[]>;
    value: string;

    searchMarkers: any = [];
    markers: any = [];
    currentMarker: any;
    mapMarkers: any = [];

    serviceNumber: number = 0;
    reviewNumber: number = 0;

    isShowPhoneList: boolean = false;

    errorMessage: any;

    isLoaded:Boolean = false;

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

    mapReady: Boolean = false;

    pagination = {
        page : 1,
        count: 100
    };

    zoom: number = 10;
    zoomMin: number = 4;

    wxs: any;

    constructor(private el: ElementRef, private zone: NgZone, private baseProvider: BaseProvider, private wxService: WXSDKService) {
        this.wxs = this.wxService.init();
        this.wxs.then(res => {
            this.getLocation();
        });
    }

    ngAfterViewInit() {
    }

    getLocation(callback?) {
        this.wxService.onGetLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                // let speed = res.speed; // 速度，以米/每秒计
                // let accuracy = res.accuracy; // 位置精度
                if( callback ){
                    callback(this.latitude, this.longitude);
                }

                this.zone.run(() => {
                    this.panTo({
                        lat: this.latitude,
                        lng: this.longitude
                    });
                });

                if(this.mapReady){
                    this.showPosition();
                }
            }
        });
    }

    private map: any;

    onReady(mapNative: any) {
        let latitude = this.latitude || 34.341568;
        let longitude = this.longitude || 108.940175;

        this.mapReady = true;

        mapNative.setOptions({
            zoom: this.zoom,
            center: new qq.maps.LatLng(latitude, longitude)
        });

        this.map = mapNative;

        // console.log(mapNative);

        //添加监听事件
        qq.maps.event.addListener(this.map, 'click', (event: any) => {
            this.zone.run(() => {
                this.hiddenInfoWindow();
                this.restoreMakerSize();
            });
        });

        // this.getDistance();

        qq.maps.event.addListener(this.map, 'bounds_changed', (event: any) => {
            this.getDistance();
            this.zone.run(() => {
                // this.distance = distance;
                this.loadMakers({});
            });
        });

        //添加监听事件
        qq.maps.event.addListener(this.map, 'dragend', (event: any) => {
            this.zone.run(() => {
                // console.log(this.map.getCenter());
            });
        });

        this.normalSize = new qq.maps.Size(40, 46);
        this.biggerSize = new qq.maps.Size(65, 72);

        this.theNullMarker = new qq.maps.MarkerImage('', new qq.maps.Size(1, 1), '', '', new qq.maps.Point(0, 0), '');

        this.loadMakers({
            latitude: latitude,
            longitude: longitude
        });

        this.showPosition();
    }



    ngOnInit() {
        this.bindEvent();
    }

    getDistance() {
        // this.distanceIndex ++ ;
        // this.distance = this.distances[this.distanceIndex];
        // return this.distance;
        // console.log('this.distance : ' + this.distance);
        // console.log(this.map);
        let bounds = this.map.getBounds();
        // console.log(bounds);
        let from = new qq.maps.LatLng(bounds.lat.minY, bounds.lng.minX);
        let to = new qq.maps.LatLng(bounds.lat.minY, bounds.lng.maxX);
        this.distance = qq.maps.geometry ? qq.maps.geometry.spherical.computeDistanceBetween(from, to) : this.distance;
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
                        /*if(this.distanceIndex <= this.distances.length) {
                            this.getDistance();
                            this.loadMakers(options);
                            this.zoomOut();
                        }*/
                        //this.loading = false;
                        //this.searchMarkers= [];
                        return ;
                    }
                    this.isLoaded = true;
                    /*if (type) {
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
                        return;
                    }*/
                    this.serviceNumber = 0;
                    this.reviewNumber = 0;
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
            this.map.zoomTo(this.zoom);
        }
    }

    setMarker(marker: any) {
        let aMarker = new qq.maps.Marker({
            position: new qq.maps.LatLng(marker.latitude_num, marker.longitude_num),
            icon: new qq.maps.MarkerImage(marker.icon, this.normalSize, '', '', this.normalSize, ''),
            map: this.map,
            flat: true
        });
        aMarker.origin = marker;
        this.mapMarkers.push(aMarker);
        this.bindClickToMaker(aMarker);
        return aMarker;
    }


    bindClickToMaker(marker: any) {
        qq.maps.event.addListener(marker, 'click', (event) => {
            this.restoreMakerSize(marker);
            this.showMarker(marker);
            /*marker.setIcon(new qq.maps.MarkerImage(icon, this.biggerSize), '', '', this.biggerSize, '');
            this.zone.run(() => {
                this.showInfoWindow(marker.origin);
            });*/
        });
    }

    showMarker(marker) {
        let icon = marker.origin.icon.replace('.png', '.big.png');
        // marker.setIcon('/assets/images/marker/blank.png');
        // console.log(marker.getIcon());
        // marker.setIcon(new qq.maps.MarkerImage('/assets/images/marker/blank.png', this.biggerSize, '', '', this.biggerSize, ''))
        // console.log(marker.getIcon());
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
            // currentMapMarker.setIcon(this.theNullMarker);
            currentMapMarker.setIcon(new qq.maps.MarkerImage(icon, this.normalSize), this.normalSize, '', this.normalSize, '');
            currentMapMarker.setZIndex(0);
        }
        this.currentMapMarker = mapMarker;
    }

    getSiteMarkerById(id) {
        let marker: any = {};
        this.mapMarkers.forEach(m => {
            if (m.origin.site_id === id) {
                marker = m;
            }
        });
        return marker;
    }

    showInfoWindow(marker) {
        this.currentMarker = marker;
        this.rate = marker.rank_score;
    }

    hiddenInfoWindow() {
        this.currentMarker = null;
        this.rate = 0;
    }

    bindEvent() {
    }

    panTo(loc) {
        if (this.map) {
            this.map.panTo(new qq.maps.LatLng(loc.lat, loc.lng));
        }
    }

    onSearch(term: string) {
        //console.log("Search");
        this.value = term;
        if (term) {
            this.loadMarkersBySearch({
                name: term
            });
        }
    }

    showPhoneList() {
        this.isShowPhoneList = true;
    }

    hiddenPhoneList() {
        this.isShowPhoneList = false;
    }

    refreshSite() {
        this.getLocation((lat, lng)=>{
            this.loadMakers({latitude: lat, longitude: lng});
        });
    }

    showPosition() {
        let latitude = this.latitude || 34.341568;
        let longitude = this.longitude || 108.940175;

        if( this.circleMarker ) {
            this.circleMarker.setMap(null);
        }

        if(qq && qq.maps && qq.maps.LatLng) {
            this.circleMarker = new qq.maps.Marker({
                position: new qq.maps.LatLng(latitude, longitude),
                clickable: false,
                zIndex:999,
                icon: new qq.maps.MarkerImage('/assets/images/marker/location.png', new qq.maps.Size(25, 25), '', '', new qq.maps.Size(25, 25), ''),
                map: this.map
            });
        }
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
