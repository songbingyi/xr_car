import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogService, DialogConfig } from 'ngx-weui/dialog';

import { ToastComponent, ToastService } from 'ngx-weui/toast';

@Component({
    selector    : 'app-order-detail',
    templateUrl : './orderDetail.html',
    styleUrls   : ['./orderDetail.scss']
})
export class OrderDetailComponent implements OnInit {

    mode : String = 'cert';
    errorMessage: any;
    detail: any;
    isLoaded: Boolean = false;
    dialogConfig: DialogConfig;
    isShowImage:Boolean = false;
    largerImg: String = '';

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService) {}

    ngOnInit() {
        let id: string = this.route.snapshot.paramMap.get('id');
        this.getInitData(id);
    }

    getInitData(id?) {
        this.isLoaded = false;
        this.baseService.post('getServiceOrderDetail', {
            'service_order_id' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                    // this.detail.service_order_status_info.service_order_status_id = '32';
                    // this.detail.service_order_status_info.service_order_status_name = '未到站';
                    // this.detail.service_order_comment = "经服务人员反馈，您在预约时间内未到站进行审车。您可修改预约时间，并重新提交审核。在通知后72小时未进行操作，该订单将自动取消并退款。";
                    if (!this.detail.service_order_id) {
                        this.showToast('没有找到此订单！');
                        this.hideToast(() => {
                            this.router.navigate(['/orders', 0]);
                        });
                    }
                } else {
                    this.errorMessage = detail.status.error_desc;
                    if (detail.status.error_code === '4004') {
                        setTimeout(() => {
                            this.router.navigate(['/orders', 0]);
                        }, 2000);
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    payOrder(service_order_id) {
        this.router.navigate(['/confirmOrder', service_order_id]);
        // window.location.href = window.location.protocol + '//' + window.location.host + '/payment/?oid=' + service_order_id;
    }


    /**
     * "操作类型
     * 1-付款
     * 2-修改订单
     * 3-删除订单 就是取消
     * 4-申请退款"
     */
    // 取消
    cancelOrder(id) {
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要删除此订单吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(id, 3);
            }
        });
        return false;
    }
    // 退款
    refundOrder(id) {
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要退款吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(id, 4);
            }
        });
        return false;
    }


    operation(id, operation) {
        this.baseService.post('operatorServiceOrder', {
            'operator_type': operation,
            'submit_service_order_info' : {'service_order_id' : id }
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    // this.detail = detail.data.service_order_info;
                    this.showResult(operation);
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    showResult(operation) {
        let msg = operation === 3 ? '删除订单成功' : '退款申请已提交请耐心等待';
        this.showToast(msg);
        this.hideToast(() => {
            if (operation === 3) {
                this.router.navigate(['/orders', 0]);
            }
        });
    }

    goPayment($event, service_order_id) {
        $event.stopPropagation();
        if(service_order_id){
            window.location.href = '/payment?oid=' + service_order_id;
        }
    }

    showToast(msg) {
        // let msg = operation === 3 ? '删除订单成功' : '退款申请已提交请耐心等待';
        this.toastService.success(msg);
    }

    hideToast(callback) {
        /*this.toastService.hide();
        if (callback) {
            callback();
        }*/
        setTimeout(() => {
            this.toastService.hide();
            if (callback) {
                callback();
            }
        }, 2000);
        // this.toastService.hide();
    }

    showImage(img?) {
        if(img){
            this.largerImg = img;
        }
        this.isShowImage = !this.isShowImage;
    }

    changeMode(type) {
        this.mode = type;
    }

    getServiceProductSpecTypeInfoByKey(key) {
        let detail = this.detail;
        let productSpecTypes = (detail && detail.service_order_product_info) ? detail.service_order_product_info.service_order_product_extend_list : [];
        let length = productSpecTypes.length;
        for ( let i = 0; i < length; i++) {
            let productSpecType = productSpecTypes[i];
            if (productSpecType.service_product_spec_type_info.service_product_spec_type_key === key) {
                return productSpecType || {};
            }
        }
        return {};
    }

    shouldShowPlaceholderBtn(item) {
        let total = 0;
        let obj: any = {};

        if (item.service_order_status_info) {
            obj = item.service_order_status_info;
        }

        if (obj.is_pay) {
            total ++ ;
        }

        if (obj.is_edit) {
            total ++ ;
        }

        if (obj.is_delete) {
            total ++ ;
        }

        if (obj.is_return) {
            total ++ ;
        }

        return total > 1;
    }


    showText(detail?) {
        let status_id = detail.service_order_status_info.service_order_status_id || this.detail.service_order_status_info.service_order_status_id;
        let text = ['实付款', '应付款'];
        let status = ['21', '22', '31', '32', '41', '51', '61', '62'];
        return status.indexOf(status_id) > -1 ? text[0] : text[1];
    }

    showFinalText(detail) {
        let status_id = detail.service_order_status_info.service_order_status_id || this.detail.service_order_status_info.service_order_status_id;
        let text = {'51':'完成时间','61':'申请退款时间','62':'退款时间'};
        return text[status_id];
    }

    shouldShowPayMethod(detail) {
        let status_id = detail.service_order_status_info.service_order_status_id || this.detail.service_order_status_info.service_order_status_id;
        let status = ['21', '22', '31', '32', '41', '51', '61', '62'];
        return status.indexOf(status_id) < 0;
    }

    shouldShowOperation(detail) {
        let status_id = detail.service_order_status_info.service_order_status_id || this.detail.service_order_status_info.service_order_status_id;
        let status = ['21', '41', '61'];
        return status.indexOf(status_id) < 0;
    }

    shouldShowDate(detail) {
        let status_id = detail.service_order_status_info.service_order_status_id || this.detail.service_order_status_info.service_order_status_id;
        let status = ['51', '61', '62'];
        return status.indexOf(status_id) > -1;
    }
}
