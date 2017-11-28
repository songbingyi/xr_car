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

    isWeChatPayReady: Boolean = false;

    constructor(private http : Http) {}

    init() {
        this.checkJsApi();
        return new Promise((resolve, reject) => {

            wx.ready(() => {
                wx.hideAllNonBaseMenuItem();
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


}
