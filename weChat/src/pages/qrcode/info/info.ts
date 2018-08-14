import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {CustomValidators} from '../../../providers/custom.validators';

import {BaseProvider} from '../../../providers/http/base.http';
import {LocalStorage} from '../../../providers/localStorage';

// import {errorCode} from '../../../assets/data/error.code';
import {DialogService, DialogConfig} from 'ngx-weui/dialog';
import {Location} from '@angular/common';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

// import { ToastComponent, ToastService } from 'ngx-weui/toast';


@Component({
    selector: 'app-qrcode-info',
    templateUrl: './info.html',
    styleUrls: ['./info.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrcodeInfoComponent implements OnInit {

    errorMessage: any;

    name = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
    ]);
    phone = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    companyName = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);


    qrcodeInfoForm: any = this.builder.group({
        name: this.name,
        companyName: this.companyName,
        phone: this.phone
    });

    result: any = {
        a: {
            valid: true
        },
        b: {
            valid: true
        },
        c: {
            valid: true
        }
    };

    fromError: Boolean = false;

    memberDetail: any;
    memberAgency: any;

    shouldShowRegisterWarningBox: boolean = true;
    shouldShowWarningBox: boolean = true;

    isLoaded = false;

    constructor(private route: ActivatedRoute, private router: Router, private builder: FormBuilder, private customValidators: CustomValidators, private baseService: BaseProvider, private localStorage: LocalStorage, private dialogService: DialogService, private location: Location, private identityAuthService: IdentityAuthService) {
        this.getMemberDetail();
        //this.identityAuthService.check();
    }

    ngOnInit() {
    }

    clearError() {
        this.errorMessage = '';
    }

    getMemberDetail() {
        this.baseService.post('getMemberDetail', {})
            .subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data || {};
                    this.shouldShowWarningBox = this.memberDetail.member_auth_info.identity_auth_status === '0';
                    this.getMemberAgencyInfo();
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getMemberAgencyInfo() {
        this.baseService.post('getMemberAgencyInfo',{})
            .subscribe(memberAgency => {
                if (memberAgency.status.succeed === '1') {
                    this.memberAgency = memberAgency.data.member_agency_info || null;
                    this.shouldShowRegisterWarningBox = !!this.memberAgency;
                } else {
                    this.errorMessage = memberAgency.status.error_desc;
                }
                this.isLoaded = true;
            }, error => this.errorMessage = <any>error);
    }

    save() {

        if (!this.qrcodeInfoForm.value.name || this.qrcodeInfoForm.value.name.length > 30) {
            this.fromError = true;
            this.errorMessage = '姓名为必填项，且长度不可超过30！';
            return;
        }

        // 手机号格式验证
        if (!this.qrcodeInfoForm.value.phone || (this.qrcodeInfoForm.value.phone && ((this.qrcodeInfoForm.value.phone + '')[0] !== '1'))) {
            this.errorMessage = '手机号格式不正确';
            return;
        }

        if (!this.qrcodeInfoForm.value.companyName || this.qrcodeInfoForm.value.companyName.length > 30) {
            this.fromError = true;
            this.errorMessage = '公司为必填项，且长度不可超过30！';
            return;
        }

        this.baseService.post('submitMemberAgency', {
            submit_member_agency_info: {
                agency_name: this.qrcodeInfoForm.value.name,
                agency_mobile: this.qrcodeInfoForm.value.phone,
                agency_company_name: this.qrcodeInfoForm.value.companyName,
            }
        }).subscribe(result => {
            if (result.status.succeed === '1') {
                this.getMemberAgencyInfo();
            } else {
                this.errorMessage = result.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    shouldShowRegister(){
        let shouldShowWarningBox = this.shouldShowWarningBox;
        let shouldShowRegisterWarningBox = this.shouldShowRegisterWarningBox;
        return !shouldShowWarningBox && !shouldShowRegisterWarningBox;
    }
    shouldShowRegisterPop(){
        return this.shouldShowWarningBox;
    }
    shouldShowQrCode(){
        let shouldShowWarningBox = this.shouldShowWarningBox;
        let shouldShowRegisterWarningBox = this.shouldShowRegisterWarningBox;
        return !shouldShowWarningBox && shouldShowRegisterWarningBox;
    }

    iSee() {
        this.shouldShowWarningBox = !this.shouldShowWarningBox;
    }
}
