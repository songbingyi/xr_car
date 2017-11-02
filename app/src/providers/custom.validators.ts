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

    public isNumber(input: FormControl) {
        let value = input.value;
        return parseInt(value, 10) === (value - 0) ? null : {isNumber : true};
    }
}
