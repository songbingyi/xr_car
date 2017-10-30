import { NgZone, OnDestroy } from '@angular/core';
/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AqmComponent } from 'angular-qq-maps';

import { RatingComponent, RatingConfig } from 'ngx-weui/rating';

import { TaobaoService } from "./tb.service";
import { Observable } from 'rxjs/Rx';

import {MarkersProvider} from '../../providers/marker.http';

import {MarkerModel} from "../../models/marker.model";

declare const qq: any;
declare const wx: any;

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

    @ViewChild('geoPage') geoPage: ElementRef;
    @ViewChild('iframe') iframe: ElementRef;

    @ViewChild('map') mapComp: AqmComponent;

    constructor(private el: ElementRef, private zone: NgZone, private tbService: TaobaoService, private markerService: MarkersProvider) {}

    ngAfterViewInit() {
        let doc = this.geoPage.nativeElement.contentWindow;
        //为防止定位组件在message事件监听前已经触发定位成功事件，在此处显示请求一次位置信息
        doc.postMessage('getLocation', '*');

        //设置6s超时，防止定位组件长时间获取位置信息未响应
        setTimeout(function() {
            if(!this.geoLocation) {
                //主动与前端定位组件通信（可选），获取粗糙的IP定位结果
                doc.postMessage('getLocation.robust', '*');
            }
        }, 6000);
    }

    private map: any;
    onReady(mapNative: any) {
        mapNative.setOptions({
            zoom: 12,
            center: new qq.maps.LatLng(39.916527, 116.397128)
        });
        this.map = mapNative;
        this.status = '加载完成';
        //添加监听事件
        qq.maps.event.addListener(this.map, 'click', (event: any) => {
            console.log(event);
            /*console.log(event);
            new qq.maps.Marker({
                position: event.latLng,
                map: this.map
            });*/
            this.zone.run(() => {
                //this.status = `click ${+new Date}`;
                this.hiddenInfoWindow();
            });
        });

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
            icon : new qq.maps.MarkerImage(marker.icon, new qq.maps.Size(40, 46), '', '', new qq.maps.Size(40, 46), ''),
            map: this.map
        });
        aMarker.origin = marker;
        this.bindClickToMaker(aMarker);
    }


    bindClickToMaker(marker: any) {
        qq.maps.event.addListener(marker, 'click', (event)=>{
            console.log(event);
            let icon = marker.origin.icon ;// ? marker.origin.icon.replace('.png', '.big.png') : marker.origin.icon;
            marker.setIcon(new qq.maps.MarkerImage(icon, new qq.maps.Size(65, 72)), '', '', new qq.maps.Size(30, 30), '');
            this.showInfoWindow(marker.origin);
        });
    }

    showInfoWindow(marker){
        this.currentMarker = marker;
        this.rate = marker.star;
    }

    hiddenInfoWindow() {
        this.currentMarker = null;
        this.rate = 0;
    }

    bindEvent() {
        window.addEventListener('message', (event) => {
            // 接收位置信息
            let loc = event.data;
            if(loc  && loc.module == 'geolocation') { //定位成功,防止其他应用也会向该页面post信息，需判断module是否为'geolocation'
                var markUrl = 'https://apis.map.qq.com/tools/poimarker' + '?marker=coord:' + loc.lat + ',' + loc.lng + ';title:我的位置;addr:' + (loc.addr || loc.city) + '&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';
                //给位置展示组件赋值
                //document.getElementById('markPage').src = markUrl;
                this.geoLocation = true;
                this.panTo(loc);
            } else { //定位组件在定位失败后，也会触发message, event.data为null
                //alert('定位失败');
                this.geoLocation = false;
            }
            /*let loc = event.data;
            if (loc.lat && loc.lng) {
                this.panTo(loc);
            }*/
        }, false);
    }

    panTo(loc) {
        //console.log(loc);
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
