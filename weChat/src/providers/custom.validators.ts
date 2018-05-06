import { Injectable } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Injectable()
export class CustomValidators {

    constructor() {
    }

    public eq(num: number) {
        return (input) => {
            let value = input.value + '';
            return value.length === num ? null : { eq: true };
        };
    }

    public isChinese(input: FormControl) {
        let CHINESE_REGEXP = /^[\u4E00-\u9FA5]+$/;
        return CHINESE_REGEXP.test(input.value) ? null : {
            validateMobile: {valid: false}
        }
    }

    public isNumber(input: FormControl) {
        let value = input.value;
        return parseInt(value, 10) === (value - 0) ? null : {isNumber : true};
    }

    public isValid(map: any, number?) {
        let result = true;

        for (let key in map) {
            if (map.hasOwnProperty(key) && key !== 'valid') {
                map[key].valid = Object.keys(map[key]).length > (number || 1);
                if (!map[key].valid) {
                    result = false;
                }
            }
        }

        map.valid = result;
        return map;
    }

    public isEmail(input: FormControl){
        let value = input.value;
        if(value){
            return Validators.email(input);
        }
    }

    public isUploaded(map: any) {
        for (let key in map) {
            if (map.hasOwnProperty(key) && !map[key]) {
                return false;
            }
        }
        return true;
    }

    public anyUploaded(map: any) {
        let anyUploaded = false;
        for (let key in map) {
            if (map.hasOwnProperty(key) && map[key]) {
                anyUploaded = true;
            }
        }
        return anyUploaded;
    }
}
