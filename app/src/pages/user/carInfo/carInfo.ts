import {Component, OnInit} from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { CustomValidators } from '../../../providers/custom.validators';

@Component({
    selector    : 'app-car-info',
    templateUrl : './carInfo.html',
    styleUrls   : ['./carInfo.scss']
})
export class CarInfoComponent implements OnInit {

    showPanel: Boolean = false;
    isShowImage: Boolean = false;

    showIdType: Boolean = false;
    showCarType: Boolean = false;


    cardId = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6)
    ]);
    companyName   = new FormControl('', [
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

    cardIdv    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    cardIdx    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);


    userInfoForm: FormGroup = this.builder.group({
        cardId: this.cardId,
        companyName: this.companyName,
        phone : this.phone,
        vcode : this.vcode,
        cardIdv : this.cardIdv,
        cardIdx : this.cardIdx
    });

    constructor(private builder: FormBuilder, private customValidators: CustomValidators) {}

    ngOnInit() {
    }

    showImage() {
        this.isShowImage = !this.isShowImage;
    }

    showIdTypeBox() {
        this.showIdType = !this.showIdType;
    }

    showCarTypeBox() {
        this.showCarType = !this.showCarType;
    }

    selectIdType() {
        this.cancelTypeBox();
    }

    selectCarType() {
        this.cancelTypeBox();
    }

    cancelTypeBox() {
        this.showIdType = false;
        this.showCarType = false;
    }

    onItemChange(data: any) {
        console.log('onItemChange', data);
    }
    onItemGroupChange(data: any) {
        console.log('onItemGroupChange', data);
    }
    onItemCancel() {
        console.log('onItemCancel');
    }
}
