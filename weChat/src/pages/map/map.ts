import {NgZone, OnDestroy} from '@angular/core';
/* tslint:disable */
import {Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
// import {AqmComponent} from 'angular-qq-maps';

import {RatingComponent, RatingConfig} from 'ngx-weui/rating';

// import { TaobaoService } from './tb.service';
import {Observable} from 'rxjs/Rx';

// import {MarkersProvider} from '../../providers/http/marker.http';

// import {MarkerModel} from '../../models/marker.model';

import {WXSDKService} from '../../providers/wx.sdk.service';
import {BaseProvider} from '../../providers/http/base.http';

import {DistancePipe} from '../../pipes/distance';
import {MessageService} from '../../providers/messageService';

// declare const qq: any;
declare var AMap;
declare var gcoord;

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

    // @ViewChild('map') mapComp: AqmComponent;

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

    clickedItemsBySearch:any = [];

    circleMarker : any;

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

    constructor(private el: ElementRef, private zone: NgZone, private baseProvider: BaseProvider, private wxService: WXSDKService, private message: MessageService) {
        //this.transformLocation();
        this.wxs = this.wxService.init();
        this.message.getMessage().subscribe(msg => {
            if(msg.type === 'refreshMap'){
                setTimeout(()=>{this.getDistance()},100);
            }
        });
    }

    ngOnInit() {
        // TODO 正式环境注释掉
        // this.onReady();
    }

    transformLocation() {
        // this.longitude = 108.94075;
        // this.latitude = 34.341568;
        //http://restapi.amap.com/v3/assistant/coordinate/convert?locations=116.481499,39.990475&coordsys=gps&output=josn&key=74ce9b3c85717bd4428faff1c89462b1
        /*let result = gcoord.transform(
            [this.longitude, this.latitude],    // 经纬度坐标
            gcoord.WGS84,                       // 当前坐标系
            gcoord.GCJ02                        // 目标坐标系
        );*/
        let url = 'http://restapi.amap.com/v3/assistant/coordinate/convert?locations=' + this.longitude + ','+ this.latitude + '&coordsys=gps&output=josn&key=74ce9b3c85717bd4428faff1c89462b1';
        this.baseProvider.pureGet(url).subscribe(position => {
            try {
                let positions = position.locations.split(",");
                this.longitude = positions[0];
                this.latitude = positions[1];
                //console.log(this.longitude);
                //console.log(this.latitude);
            } catch(e) {
                this.transformLocationNative();
            }

        },error => {
            this.transformLocationNative();
        });
        /*console.log(this.longitude);
        console.log(this.latitude);
        console.log("-------------------------");
        this.longitude = parseFloat(parseFloat(result[0]).toFixed(6));
        this.latitude = parseFloat(parseFloat(result[1]).toFixed(6));
        console.log(this.longitude);
        console.log(this.latitude);*/
    }

    transformLocationNative(){
        let result = gcoord.transform(
            [this.longitude, this.latitude],    // 经纬度坐标
            gcoord.WGS84,                       // 当前坐标系
            gcoord.GCJ02                        // 目标坐标系
        );
        this.longitude = parseFloat(parseFloat(result[0]).toFixed(6));
        this.latitude = parseFloat(parseFloat(result[1]).toFixed(6));
    }

    getLocation(callback?) {
        let self = this;
        this.wxService.onGetLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                //self.transformLocation();
                if( callback ){
                    callback(self.latitude, self.longitude);
                }else{
                    this.onReady();
                }
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
            center:[this.longitude, this.latitude],
            zoom:this.zoom,
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

        AMap.event.addListener(map, 'zoomend', (event: any) => {
            this.getDistance();
            console.log('zoomend');
            this.zone.run(() => {
                // this.distance = distance;
                this.loadMakers({
                    latitude: this.latitude,
                    longitude: this.longitude
                }, true);
            });
        });

        //添加监听事件
        AMap.event.addListener(map, 'dragend', (event: any) => {
            this.zone.run(() => {
                // console.log(this.map.getCenter());
            });
        });

        this.map = map;

        // console.log(this.map);

        this.normalSize = new AMap.Size(40, 46);
        this.biggerSize = new AMap.Size(65, 72);

        this.getDistance();

        this.loadMakers({
            latitude: this.latitude,
            longitude: this.longitude
        });

        this.showPosition();
    }

    getDistance() {
        // this.distanceIndex ++ ;
        // this.distance = this.distances[this.distanceIndex];
        // return this.distance;
        // console.log('this.distance : ' + this.distance);
        // console.log(this.map);
        let bounds = this.map.getBounds();
        // console.log(bounds);
        // console.log(bounds.getNorthEast());
        let from = new AMap.LngLat(bounds.getNorthEast().lng, bounds.getNorthEast().lat);
        let to = new AMap.LngLat(bounds.getSouthWest().lng, bounds.getSouthWest().lat);
        //alert(JSON.stringify(bounds.getNorthEast()));
        // alert(JSON.stringify(from));
        // alert(JSON.stringify(to));
        // alert(this.distance);
        this.distance = AMap.GeometryUtil ? AMap.GeometryUtil.distance(from, to) : this.distance;
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


    loadMakers(options, isZooming?) {
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
                        if(!isZooming){
                            this.zoomOut();
                            return ;
                        }
                    }
                    this.map.remove(this.mapMarkers);
                    this.isLoaded = true;
                    this.serviceNumber = 0;
                    this.reviewNumber  = 0;
                    this.markers = markers.data.site_list;
                    // 通过搜索并点击显示在地图中的站点，清除之后还要再加载进来
                    this.clickedItemsBySearch.forEach(marker => {
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
                        this.setMarker(marker);
                    });
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
            // console.log(this.currentMarkerExtra);
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
        }else {
            return '处理中...';
        }
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

        /*let aMarker = new AMap.Marker({
            position: new AMap.LngLat(marker.longitude_num, marker.latitude_num),
            icon: new AMap.Icon({size:this.normalSize, image:marker.icon, imageSize:this.normalSize}), //marker.icon, this.normalSize, '', '', this.normalSize, ''
            map: this.map,
            clickable: true,
            topWhenClick: true,
            extData : marker,
            offset : new AMap.Pixel(-20, -46)
        });*/

        if(AMap.Marker && AMap.LngLat) {
            this.circleMarker = new AMap.Marker({
                position: new AMap.LngLat(longitude, latitude),
                clickable: false,
                zIndex:999,
                icon: new AMap.Icon({size:new AMap.Size(25, 25), image:'/assets/images/marker/location.png', imageSize:new AMap.Size(25, 25)}),
                //icon: new AMap.Icon('/assets/images/marker/location.png', new qq.maps.Size(25, 25), '', '', new qq.maps.Size(25, 25), ''),
                map: this.map
            });
        }
    }

    showPhoneList() {
        this.isShowPhoneList = true;
    }

    hiddenPhoneList() {
        this.isShowPhoneList = false;
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
            this.clickedItemsBySearch.push(item);
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
