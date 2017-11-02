import {Component, OnInit} from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { CustomValidators } from '../../../providers/custom.validators';

@Component({
    selector    : 'app-user-info',
    templateUrl : './userInfo.html',
    styleUrls   : ['./userInfo.scss']
})
export class UserInfoComponent implements OnInit {
    hasPhone : Boolean = false;
    errorMsg: String;

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

    constructor(private builder: FormBuilder, private customValidators: CustomValidators) { }

    save() {
        if (this.userInfoForm.invalid) {
            this.errorMsg = '请修改红色错误信息后再提交';
        }else{
            this.errorMsg = '';
        }
    }

    update() {
        if (this.updateForm.invalid) {
            this.errorMsg = '请修改红色错误信息后再提交';
        }else{
            this.errorMsg = '';
        }
    }

    ngOnInit() {
    }

    focus(ev) {
        console.log(ev.target.addClass('active'));
    }
    blur(ev) {
        console.log(ev.target.removeClass('active'));
    }
}
