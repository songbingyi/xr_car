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

    // 地图对象
    map:any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    pagination = {
        page : 1,
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
        this.map = new AMap.Map('gaoDeMap', {
            resizeEnable: true,
            mapStyle: 'amap://styles/fresh',
            center: [this.longitude, this.latitude],
            zoom: this.zoom
        });
    }


}
