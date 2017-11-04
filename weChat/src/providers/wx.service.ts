import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { JWeiXinService } from 'ngx-weui/jweixin';

declare const wx: any;

/**
 * 微信JS-SDK服务器
 */
@Injectable()
export class WXService {
    private static DEFAULTSHARE: any = {
        title: 'Site Name',
        desc: '',
        link: '',
        imgUrl: ''
    };
    constructor(private wxService: JWeiXinService, private http: Http) { }

    private share: any;
    config(shareData: any): Promise<boolean> {
        this.share = shareData;
        return new Promise((resolve, reject) => {
            this.wxService.get().then((res) => {
                if (!res) {
                    reject('jweixin.js 加载失败');
                    return;
                }

                wx.ready(() => {
                    this._onMenuShareTimeline()
                        ._onMenuShareAppMessage()
                        ._onMenuShareQQ()
                        ._onMenuShareQZone()
                        ._onMenuShareWeibo();

                    resolve();
                });
                wx.error(() => {
                    console.log('config 注册失败');
                    reject('config 注册失败');
                });

                this.http
                    .get('http://localhost:9020/api/wechatPay/accessToken?u=' + encodeURIComponent(location.href.split('#')[0]))
                    .map(res => { return res.json(); })
                    .catch((error: Response | any) => {
                        console.log('无法获取签名数据');
                        reject('无法获取签名数据');
                        return Observable.throw('error');
                    })
                    .subscribe((res) => {
                        let wxConfig: any = res;
                        // wxConfig.debug = true;
                        wxConfig.jsApiList = [
                            // 所有要调用的 API 都要加到这个列表中
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getLocation',
                            'chooseWXPay',
                            'hideAllNonBaseMenuItem'
                        ];
                        /*
                        debug     : false,
                        appId     : $scope.wxConfig.appId,
                        timestamp : $scope.wxConfig.timestamp,
                        nonceStr  : $scope.wxConfig.nonceStr,
                        signature : $scope.wxConfig.signature,
                        jsApiList : [
                            // 所有要调用的 API 都要加到这个列表中
                            'chooseWXPay',
                            'hideAllNonBaseMenuItem'
                        ]
                        */
                        wx.config(wxConfig);
                    });
            });
        });
    }

    private _onMenuShareTimeline() {
        wx.onMenuShareTimeline(Object.assign({}, WXService.DEFAULTSHARE, this.share));
        return this;
    }

    private _onMenuShareAppMessage() {
        wx.onMenuShareAppMessage(Object.assign({}, WXService.DEFAULTSHARE, this.share));
        return this;
    }

    private _onMenuShareQQ() {
        wx.onMenuShareQQ(Object.assign({}, WXService.DEFAULTSHARE, this.share));
        return this;
    }

    private _onMenuShareWeibo() {
        wx.onMenuShareWeibo(Object.assign({}, WXService.DEFAULTSHARE, this.share));
        return this;
    }

    private _onMenuShareQZone() {
        wx.onMenuShareQZone(Object.assign({}, WXService.DEFAULTSHARE, this.share));
        return this;
    }

    onChooseImage(params) {
        wx.chooseImage(params);
        return this;
    }

    onUploadImage(params) {
        wx.uploadImage(params);
        return this;
    }
}
