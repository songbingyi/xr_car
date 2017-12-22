import {Component, OnInit, NgZone} from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { LocalStorage } from '../../../providers/localStorage';
import { Md5 } from '../../../providers/md5/md5';

import { CustomValidators } from '../../../providers/custom.validators';
import { BaseProvider } from '../../../providers/http/base.http';

import { config } from '../../../app/app.config';


@Component({
    selector    : 'app-user-info',
    templateUrl : './userInfo.html',
    styleUrls   : ['./userInfo.scss']
})
export class UserInfoComponent implements OnInit {
    hasPhone : boolean = false;
    isModifying: boolean = false;
    verifyCode: any;

    timeOut = 60;
    timing: boolean = false;

    errorMessage: any;
    memberDetail: any;
    identityAuthStatus: boolean = true;

    username = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6)
    ]);
    userId   = new FormControl('', [
        Validators.required,
        this.customValidators.eq(18)
    ]);
    phone    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    vcode    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);

    updatePhone    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    updateVcode    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);

    userInfoForm: FormGroup = this.builder.group({
        username: this.username,
        userId: this.userId,
        phone : this.phone,
        vcode : this.vcode
    });

    updateForm: FormGroup = this.builder.group({
        phone : this.updatePhone,
        vcode : this.updateVcode
    });

    fromError: Boolean = false;

    constructor(private builder: FormBuilder, private baseService: BaseProvider, private customValidators: CustomValidators, private localStorage: LocalStorage, private zone: NgZone) {
        this.getCarAndMemberInfo();
    }

    getCarAndMemberInfo() {
        this.baseService.post('getMemberDetail', {
            // 'member_id' : '1'
        })
            .subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data;
                    this.identityAuthStatus = this.memberDetail.member_auth_info.identity_auth_status !== '0';
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    save() {
        if (this.userInfoForm.invalid) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            this.fromError = true;
            return ;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }
        this.baseService.post('editMemberInfo', {
            // 'member_id' : '1',
            'mobile' : this.userInfoForm.value.phone,
            'real_name'  : this.userInfoForm.value.username,
            'id_number'  : this.userInfoForm.value.userId,
            'verify_code' : Md5.hashStr(this.verifyCode.code + config.salt_key)
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    /*this.verifyCode = verifyCode.data;
                    this.timeOut = 60;
                    this.timing = true;
                    this.timeLeft();*/
                    this.isModifying = false;
                    this.getCarAndMemberInfo();
                } else {
                    this.errorMessage = result.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    update() {
        if (this.updateForm.invalid) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            this.fromError = true;
            return ;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }
        this.baseService.post('editMemberInfo', {
            // 'member_id' : '1',
            'mobile' : this.updateForm.value.phone,
            'verify_code' : Md5.hashStr(this.verifyCode.code + config.salt_key)
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    /*this.verifyCode = result.data;
                    this.timeOut = 60;
                    this.timing = true;
                    this.timeLeft();*/
                    this.isModifying = false;
                    this.getCarAndMemberInfo();
                } else {
                    this.errorMessage = result.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getVCode() {
        let phone = this.userInfoForm.value.phone;

        if (this.isModifying) {
            phone = this.updateForm.value.phone;
        }

        if (!phone) {
            this.errorMessage = '手机号码为必填项！';
            return ;
        } else {
            this.errorMessage = '';
        }

        this.baseService.post('getVerifyCode', {
            'mobile' : phone,
            'code' : Md5.hashStr(phone + '' + config.salt_key)
        })
            .subscribe(verifyCode => {
                if (verifyCode.status.succeed === '1') {
                    this.verifyCode = verifyCode.data;
                    this.timeOut = 60;
                    this.timing = true;
                    this.timeLeft();
                } else {
                    this.errorMessage = verifyCode.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    timeLeft() {
        /*this.zone.run(() => {
            if (this.timeOut > 0) {
                this.timeOut --;
                this.timing = true;
                setTimeout(() => { this.timeLeft(); }, 1000);
            } else {
                this.timing = false;
            }
        });*/
        if (this.timeOut > 0) {
            this.timeOut --;
            this.timing = true;
            setTimeout(() => { this.timeLeft(); }, 1000);
        } else {
            this.timing = false;
        }
    }

    ngOnInit() {
    }
}
