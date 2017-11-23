import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {BaseProvider} from '../../../providers/http/base.http';

@Component({
    selector    : 'app-carlist',
    templateUrl : './carList.html',
    styleUrls   : ['./carList.scss']
})
export class CarListComponent implements OnInit {

    errorMessage : any;

    carList : any = [];
    carListIndex : string[] = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    constructor(private router: Router, private baseService : BaseProvider) {
        this.getInitData();
    }

    ngOnInit() {
    }

    getInitData() {
        this.baseService.post('getMemberCarList', {
            'member_id' : '1'
        })
            .subscribe(carList => {
                if (carList.status.succeed) {
                    this.carList = carList.data.member_car_list;
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    modify(item) {
        // this.operation(2, item);
        this.router.navigate(['/carInfo', item]);
    }

    delete(item) {
        this.operation(3, item);
    }

    operation(type, item) {
        this.baseService.post('editMemberCar', {
            'member_id' : '1',
            'operator_type' : type,
            'car_info' : {
                'car_id' : item.car_id,
                'province_code_info' : {
                    'province_code_id' : item.province_code_info.province_code_id,
                    'province_code_name' : item.province_code_info.province_code_name
                },
                'plate_no' : item.plate_no,
                'company_info' : {
                    'company_id' : item.company_info.company_id,
                    'company_name' : item.company_info.company_name
                },
                'car_property_info' : {
                    'car_property_id' : item.car_property_info.car_property_id,
                    'car_property_name' : item.car_property_info.car_property_name
                },
                'car_type_info' : {
                    'car_type_id' : item.car_type_info.car_type_id,
                    'car_type_name' : item.car_type_info.car_type_name
                },
                'vin_no' : item.vin_no,
                'engine_no' : item.engine_no
            }
        })
            .subscribe(carList => {
                if (carList.status.succeed) {
                    this.carList = carList.data.member_car_list;
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

}
