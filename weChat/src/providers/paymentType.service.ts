import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { BaseProvider } from './http/base.http';

declare const wx: any;

@Injectable()
export class PaymentTypeList {

    paymentTypeMap : any;
    errorMessage : any;

    constructor(private baseService: BaseProvider) {
        this.init();
    }

    init() {
        if (!this.paymentTypeMap) {
            this.loadPaymentTypeList();
        }
    }

    loadPaymentTypeList() {
        this.baseService.post('getPaymentCodeList', {})
            .subscribe(paymentTypeMap => {
                if (paymentTypeMap.status.succeed) {
                    this.paymentTypeMap = paymentTypeMap.data.payment_code_list;
                    console.log(this.paymentTypeMap);
                } else {
                    this.errorMessage = paymentTypeMap.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getTypeById(id = 1) {
        let paymentTypeMap = this.paymentTypeMap;
        let len          = paymentTypeMap.length;

        for (let i = 0; i < len; i++) {
            let paymentType = paymentTypeMap[i];
            if (paymentType.payment_code_id === id) {
                return paymentType;
            }
        }

        return paymentTypeMap[0];
    }

    getPaymentLength() {
        return this.paymentTypeMap.length;
    }

}
