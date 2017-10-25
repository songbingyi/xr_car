import { NgZone, OnDestroy } from '@angular/core';
/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AqmComponent } from 'angular-qq-maps';

declare const qq: any;

@Component({
    selector    : 'app-map',
    templateUrl : './map.html',
    styleUrls   : ['./map.scss']
})
export class MapComponent implements OnInit {
    options: any = {};
    status: string = '';
    geoLocation : boolean = false;

    @ViewChild('geoPage') geoPage: ElementRef;
    @ViewChild('iframe') iframe: ElementRef;

    @ViewChild('map') mapComp: AqmComponent;

    constructor(private el: ElementRef, private zone: NgZone) {}

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
            new qq.maps.Marker({
                position: event.latLng,
                map: this.map
            });
            this.zone.run(() => {
                this.status = `click ${+new Date}`;
            });
        });
    }

    ngOnInit() {
        this.bindEvent();
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
        console.log(loc);
        this.map.panTo(new qq.maps.LatLng(loc.lat, loc.lng));
    }
}
