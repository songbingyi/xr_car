import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogService, DialogConfig } from 'ngx-weui/dialog';

import { ToastComponent, ToastService } from 'ngx-weui/toast';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

import { config } from '../../../app/app.config';
import {PopupComponent} from 'ngx-weui/popup';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector    : 'app-product-order-detail',
    templateUrl : './orderDetail.html',
    styleUrls   : ['./orderDetail.scss']
})
export class ProductOrderDetailComponent implements OnInit {

    mode : String = 'cert';
    errorMessage: any;
    detail: any;
    isLoaded: Boolean = false;
    dialogConfig: DialogConfig;
    isShowImage:Boolean = false;
    roleId: any = '';
    orderId: String = '';

    institutionDealer:any = [];
    isInstitutionDealerLoad = false;

    @ViewChild('fullDealer') fullDealerPopup: PopupComponent;

    institutionDealerList:any = [];

    selectedDealer:any = {};

    canCloseOrderStatus = ["1002", "1003"];


    submitting:boolean = false;
    outerDmsNo   = new FormControl('', []);
    orderForm: FormGroup = this.builder.group({
        outerDmsNo     : this.outerDmsNo
    });
    fromError: Boolean = false;

    constructor(private builder: FormBuilder, private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.roleId = this.route.snapshot.queryParams.role;
        this.getInitData(this.orderId, this.roleId);
    }

    getInitData(id?, roleId?) {
        this.isLoaded = false;
        this.baseService.post('gerCarProductOrderDetail', {
            'car_product_order_id' : id,
            'member_role_id' : roleId
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.car_product_order_info;
                    //this.detail.outer_dms_no = this.detail.outer_dms_no ? (this.detail.outer_dms_no + '') : '';
                    if (!this.detail.car_product_order_id) {
                        this.showToast('没有找到此订单！');
                        this.hideToast(() => {
                            this.goBack();
                            // this.router.navigate(['/serviceOrder', 0]);
                        });
                    }
                } else {
                    this.errorMessage = detail.status.error_desc;
                    if (detail.status.error_code === '4004') {
                        setTimeout(() => {
                            this.goBack();
                            //this.router.navigate(['/serviceOrder', 0]);
                        }, 2000);
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    getInstitutionDealerListByCarProductOrder(id?, roleId?) {
        this.isInstitutionDealerLoad = false;
        this.baseService.post('getInstitutionDealerListByCarProductOrder', {
            'member_role_id' : roleId,
            'car_product_order_id' : id
        })
            .subscribe(institutionDealer => {
                if (institutionDealer.status.succeed === '1') {
                    this.isLoaded = true;
                    this.institutionDealer = institutionDealer.data.institution_dealer_group_by_region_list;
                    this.fullDealerPopup.show();
                    this.isInstitutionDealerLoad = true;
                    // console.log(this.institutionDealer);
                    // this.detail.car_product_order_status_info.car_product_order_status_id = '32';
                    // this.detail.car_product_order_status_info.service_order_status_name = '未到站';
                    // this.detail.service_order_comment = "经服务人员反馈，您在预约时间内未到站进行审车。您可修改预约时间，并重新提交审核。在通知后72小时未进行操作，该订单将自动取消并退款。";
                    /*if (!this.detail.car_product_order_id) {
                        this.showToast('没有找到此订单！');
                        this.hideToast(() => {
                            this.goBack();
                            // this.router.navigate(['/serviceOrder', 0]);
                        });
                    }*/
                } else {
                    this.errorMessage = institutionDealer.status.error_desc;
                    /*if (institutionDealer.status.error_code === '4004') {
                        setTimeout(() => {
                            this.goBack();
                            //this.router.navigate(['/serviceOrder', 0]);
                        }, 2000);
                    }*/
                }
            }, error => this.errorMessage = <any>error);
    }

    showDealer() {
        this.errorMessage = null;
        this.getInstitutionDealerListByCarProductOrder(this.orderId, this.roleId);
    }

    dmsFocused() {
        this.errorMessage = null;
    }

    goBack() {
        if(!config.identityAuth){
            this.location.back();
        }
    }

    canCloseOrder() {
        // 角色为 3 时的待分配或者待处理，可以关闭
        let orderStatus = this.detail && this.detail.car_product_order_status_info;
        return this.roleId === '3' && orderStatus && this.canCloseOrderStatus.indexOf(orderStatus.car_product_order_status_id) > -1;
    }

    canSubmitOrder(role) {
        let orderStatus = this.detail && this.detail.car_product_order_status_info;
        // 角色为 3 时的待分配，角色为 4 时的待处理可以修改订单。
        if(role === '3'){
            return this.roleId === '3' && orderStatus && orderStatus.car_product_order_status_id === '1002';
        }
        if(role === '4'){
            return this.roleId === '4' && orderStatus && orderStatus.car_product_order_status_id === '1003';
        }
    }

    payOrder(service_order_id) {
        this.router.navigate(['/confirmOrder', service_order_id]);
        // window.location.href = window.location.protocol + '//' + window.location.host + '/payment/?oid=' + service_order_id;
    }


    /**
     * 1-取消订单
     * 2-删除订单
     * 3-分配给经销商
     * 4-经销商确认订单
     */
    // 删除
    cancelOrder(id?) {
        this.router.navigate(['/cancelOrder',this.detail.car_product_order_id], {queryParams:{role:this.roleId}});
        /*this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要删除此订单吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(this.detail.car_product_order_id, 2);
            }
        });*/
        return false;
    }
    // 提交订单
    submitOrder(id?) {
        if(this.roleId === '3' && !this.selectedDealer.institution_dealer_id){
            this.errorMessage = '请先选择经销商！';
            return;
        }
        if(this.roleId === '4' && !this.orderForm.controls.outerDmsNo.value){
            this.errorMessage = '请先输入订单编码信息！';
            return;
        }
        // 3 角色是 3 的分配给经销商，角色是 4 的经销商确认订单。
        let operationType = this.roleId === '3' ? 3 : 4;
        let msg = this.roleId === '3' ? '您确定要分配此订单吗？' : '您确定要确认此订单吗？';
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: msg
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(this.detail.car_product_order_id, operationType);
            }
        });
        return false;
    }


    operation(id, operation) {
        this.baseService.post('operatorCarProductOrder', {
            'operator_type': operation,
            'submit_car_product_order_info' : {
                'institution_dealer_info' : this.selectedDealer,
                'outer_dms_no' : (this.orderForm.controls.outerDmsNo.value + ''),
                'car_product_order_description' : '' // 订单描述(1-取消原因)
            },
            'member_role_id' : this.roleId,
            'car_product_order_id' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.getInitData(this.orderId, this.roleId);
                    // this.detail = detail.data.service_order_info;
                    // this.showResult(operation);
                } else {
                    this.errorMessage = detail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    selectDealer(dealer){
        this.selectedDealer = dealer;
        this.fullDealerPopup.close();
    }

    showResult(operation) {
        let msg = operation === 3 ? '删除订单成功' : '提交订单成功';
        this.showToast(msg);
        this.hideToast(() => {
            if (operation === 3) {
                this.location.back();
                // this.router.navigate(['/serviceOrder', 0]);
            }
        });
    }

    showToast(msg) {
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
}
