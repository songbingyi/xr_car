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
     * 2-取消订单  (修改？)
     * 3-删除订单 就是取消
     * 4-申请退款"
     */
    // 取消
    cancelOrder(id) {
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要取消此订单吗？'
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
        let msg = operation === 3 ? '取消订单成功' : '退款申请已提交请耐心等待';
        this.showToast(msg);
        this.hideToast(() => {
            if (operation === 3) {
                this.router.navigate(['/orders', 0]);
            }
        });
    }

    showToast(msg) {
        // let msg = operation === 3 ? '取消订单成功' : '退款申请已提交请耐心等待';
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

}
