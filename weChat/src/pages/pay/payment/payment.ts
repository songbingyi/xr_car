import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent, ToastService} from 'ngx-weui/toast';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';

import { WXSDKService } from '../../../providers/wx.sdk.service';

@Component({
    selector    : 'app-payment',
    templateUrl : './payment.html',
    styleUrls   : ['./payment.scss']
})
export class PaymentComponent implements OnInit {

    @ViewChild('success') successToast: ToastComponent;
    @ViewChild('loading') loadingToast: ToastComponent;

    order: any;
    errorMessage: any;
    isLoaded: Boolean = false;
    payResult: any;

    wx : any;

    constructor(private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private wxService : WXSDKService) {
        this.wx = this.wxService.init();
    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.loadOrder(id);
    }

    loadOrder(id) {
        this.baseProvider.post('getServiceOrderDetail', {
            'service_order_id': id
        }).subscribe(order => {
                if (order.status.succeed) {
                    this.order = order.data.service_order_info;
                    this.isLoaded = true;
                } else {
                    this.errorMessage = order.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    payOrder() {
        this.onShow('loading');
        let service_order_id = this.order.service_order_id;

        this.baseProvider.post('payWithWechat', {
            'service_order_id': service_order_id
        })
            .subscribe(signData => {
                if (signData.status.succeed) {
                    let sign = signData.data.sign;
                    this.payResult = signData.data.sign_data;
                    this.isLoaded = true;

                    this.wx.chooseWXPay({
                        'appId'    : sign.appId,
                        'timestamp': sign.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        'nonceStr' : sign.nonceStr, // 支付签名随机串，不长于 32 位
                        'package'  : sign.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        'signType' : 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        'paySign'  : sign.paySign, // 支付签名
                        'success'  : (res) => {
                            // alert(JSON.stringify(res));
                            if (res.errMsg === 'chooseWXPay:ok') {
                                // $scope.weChatPayObj.payingSuccess = true;
                                this.onShow('success');
                                setTimeout(() => {
                                    this.router.navigate(['/payComplete', service_order_id]);
                                }, 3000);
                            } else if (res.errMsg === 'chooseWXPay:cancel') {
                                this.onShow('success');
                            } else {
                                alert('支付可能出现错误，请和收费人员确认是否成功，或重试。');
                            }
                        },
                        'cancel'   : (res) => {
                            // alert(JSON.stringify(res));
                            alert('取消支付，请重试。');
                        },
                        fail     : (res) => {
                            // alert(JSON.stringify(res));
                            alert('支付失败，请重试。');
                        }
                    });




                } else {
                    this.errorMessage = signData.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );


        /*setTimeout(() => {
            this.onShow('success');
        }, 3000);
        setTimeout(() => {
            this.router.navigate(['/payComplete', service_order_id]);
        }, 5000);*/
    }

    onShow(type: 'success' | 'loading') {
        (<ToastComponent>this[`${type}Toast`]).onShow();
    }


}
