import {Observable} from 'rxjs/Rx';
import {Headers, Http, RequestOptions, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {JWeiXinService} from 'ngx-weui/jweixin';

import {config} from '../app/app.config';

declare const wx : any;

/**
 * 微信JS-SDK服务器
 */
@Injectable()
export class WXSDKService {

    isWeChatPayReady: Boolean = false;

    constructor(private http : Http) {}

    setSearchParams(path, data) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('route', path);
        urlSearchParams.append('jsonText', JSON.stringify(data));
        urlSearchParams.append('device_type', '40');
        urlSearchParams.append('device_version', '1.0');
        urlSearchParams.append('version_code', '1');
        urlSearchParams.append('channel', '10001');
        return urlSearchParams;
    }

    getHeader() {
        let headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return new RequestOptions({headers : headers});
    }

    init() {
        this.checkJsApi();
        return new Promise((resolve, reject) => {

            wx.ready(() => {
                // wx.hideAllNonBaseMenuItem();
                resolve(wx);
            });

            wx.error(() => {
                console.log('config 注册失败');
                reject('config 注册失败');
            });

            // let url = encodeURIComponent(location.href.split('#')[0]);
            let url = location.href.split('#')[0];
            // alert(url);
            let urlSearchParams = this.setSearchParams('base/tools/getWxSignPackage', {'url' : url});
            // console.log(url);
            // this.http.get('http://localhost:9020/api/wechatPay/accessToken?u=' + url)
            this.http.post(config.api, urlSearchParams, this.getHeader())
                .map(response => {
                    // console.log(response.json().data.signPackage);
                    // let a = response;
                    // console.log(response);
                    return response.json();
                })
                .catch((error : Response | any) => {
                    console.log('无法获取签名数据');
                    reject('无法获取签名数据');
                    return Observable.throw(error);
                })
                .subscribe((response) => {
                    let wxConfig : any = response.data.signPackage;
                    // console.log(response);
                    // console.log(wxConfig);
                    wxConfig.jsApiList = [
                        // 所有要调用的 API 都要加到这个列表中
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getLocation',
                        'chooseWXPay'/*,
                        'hideAllNonBaseMenuItem'*/
                    ];
                     // wxConfig.debug = true;
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

    checkJsApi() {
        let self = this;
        wx.checkJsApi({
            jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success  : (res) => {
                // alert(JSON.stringify(res));
                if (res.checkResult.chooseWXPay) {
                    self.isWeChatPayReady = true;
                } else {
                    // alert("微信版本过低，请升级最新版本微信。");
                    self.isWeChatPayReady = false;
                }
                // console.log(self.isWeChatPayReady);
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
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

    onChooseWXPay(params) {
        wx.chooseWXPay(params);
        return this;
    }


}
