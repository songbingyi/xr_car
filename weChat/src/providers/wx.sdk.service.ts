import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {JWeiXinService} from 'ngx-weui/jweixin';

declare const wx : any;

/**
 * 微信JS-SDK服务器
 */
@Injectable()
export class WXSDKService {

    constructor(private http : Http) {}

    init() {
        return new Promise((resolve, reject) => {

            wx.ready(() => {
                resolve();
            });

            wx.error(() => {
                console.log('config 注册失败');
                reject('config 注册失败');
            });

            this.http.get('http://localhost:9020/api/wechatPay/accessToken?u=' + encodeURIComponent(location.href.split('#')[0]))
                .map(response => {
                    let a = response;
                    return response.json();
                })
                .catch((error : Response | any) => {
                    console.log('无法获取签名数据');
                    reject('无法获取签名数据');
                    return Observable.throw(error);
                })
                .subscribe((response) => {
                    let wxConfig : any = response;
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
    }

    onChooseImage(params) {
        wx.chooseImage(params);
        return this;
    }

    onUploadImage(params) {
        wx.uploadImage(params);
        return this;
    }

    onGetLocation(params) {
        wx.getLocation(params);
        return this;
    }


}
