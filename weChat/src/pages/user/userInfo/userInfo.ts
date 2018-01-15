import {Component, OnInit, NgZone} from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { LocalStorage } from '../../../providers/localStorage';
import { Md5 } from '../../../providers/md5/md5';

import { CustomValidators } from '../../../providers/custom.validators';
import { BaseProvider } from '../../../providers/http/base.http';

import { config } from '../../../app/app.config';
import {IdentityAuthService} from '../../../providers/identityAuth.service';


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

    identityAuth: boolean;

    constructor(private builder: FormBuilder, private baseService: BaseProvider, private customValidators: CustomValidators, private localStorage: LocalStorage, private zone: NgZone, private identityAuthService:IdentityAuthService) {
        this.getCarAndMemberInfo();
        this.identityAuth = config.identityAuth;
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
        let userId = this.userInfoForm.value.userId;
        let mobile = this.userInfoForm.value.phone;
        //let regxU15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        let regxU18 = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
        let regxM = (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);

        // 身份证号格式验证
        if(userId && (/*!regxU15.test(userId) && */!regxU18.test(userId))){
            this.errorMessage = '身份证号格式不正确';
            return ;
        }

        // 手机号格式验证
        if(mobile && (!regxM.test(mobile))){
            this.errorMessage = '手机号格式不正确';
            return ;
        }

        if (this.userInfoForm.invalid) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            this.errorMessage = '';
            this.fromError = true;
            return ;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }
        //console.log();
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
                    this.userInfoForm.controls.phone.setValue('');
                    this.userInfoForm.controls.username.setValue('');
                    this.userInfoForm.controls.userId.setValue('');
                    this.userInfoForm.controls.vcode.setValue('');
                    if(config.identityAuth){
                        this.identityAuthService.goHome();
                    }else{
                        this.getCarAndMemberInfo();
                    }
                } else {
                    if(result.status.error_code === '1012'){
                        this.errorMessage = '验证码不正确，请重新输入！' || result.status.error_desc;
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    update() {
        // console.log(this.updateForm);
        if (this.updateForm.invalid) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            this.errorMessage = '';
            this.fromError = true;
            return ;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }

        if(!this.verifyCode || !this.verifyCode.code){
            this.fromError = true;
            this.errorMessage = '请先获取验证码再提交！';
            return ;
        }

        if(!this.updateForm.value.vcode){
            this.fromError = true;
            this.errorMessage = '请输入有效的验证码！';
            return ;
        }

        if(this.verifyCode && this.verifyCode.verify_code && this.updateForm.value.vcode && (this.verifyCode.verify_code !== this.updateForm.value.vcode)){
            //this.fromError = true;
            this.errorMessage = '输入的验证码不正确！';
            return ;
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
                    this.timeOut = 60;
                    this.timing = false;
                    this.isModifying = false;
                    this.updateForm.controls.phone.setValue('');
                    this.updateForm.controls.vcode.setValue('');
                    this.getCarAndMemberInfo();
                } else {
                    if(result.status.error_code === '1012'){
                        this.errorMessage = '验证码不正确，请重新输入！' || result.status.error_desc;
                    }else{
                        this.errorMessage = result.status.error_desc;
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    getVCode() {
        let phone = this.userInfoForm.value.phone;
        let regxM = (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);

        if (this.isModifying) {
            phone = this.updateForm.value.phone;
        }

        // 手机号格式验证
        if(phone && (!regxM.test(phone))){
            this.errorMessage = '手机号格式不正确';
            return ;
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
