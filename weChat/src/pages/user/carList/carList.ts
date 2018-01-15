import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {BaseProvider} from '../../../providers/http/base.http';
import {LocalStorage} from '../../../providers/localStorage';

import { DialogService, DialogConfig } from 'ngx-weui/dialog';
import { ToastComponent, ToastService } from 'ngx-weui/toast';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

@Component({
    selector    : 'app-carlist',
    templateUrl : './carList.html',
    styleUrls   : ['./carList.scss']
})
export class CarListComponent implements OnInit {

    errorMessage : any;

    dialogConfig: DialogConfig;

    carList : any = [];
    carListIndex : string[] = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    maxCar : Number = 3; // 最多几辆车

    constructor(private router: Router, private baseService : BaseProvider, private localStorage: LocalStorage, private toastService: ToastService, private dialogService: DialogService, private identityAuthService:IdentityAuthService) {
        this.getInitData();
        this.identityAuthService.check();
    }

    ngOnInit() {
    }

    getInitData() {
        this.baseService.post('getMemberCarList', {})
            .subscribe(carList => {
                if (carList.status.succeed === '1') {
                    this.carList = carList.data.member_car_list;
                    this.carList.forEach(car => {
                        let plateNo = car.plate_no;
                        let prefix = plateNo.slice(0, 1);
                        car.plate_no_formatted = plateNo.replace(prefix, (prefix + '·'));
                    });
                    if(!this.carList.length){
                        this.router.navigate(['/carInfo']);
                    }
                    // this.carList[1].is_modify = '0';
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    modify(item) {
        // this.operation(2, item);
        if(item.is_modify === '0') {
            return;
        }
        this.localStorage.setObject('carInfo', item);
        this.router.navigate(['/carInfo']);
    }

    delete(item) {
        if(item.is_delete === '0') {
            return;
        }
        this.dialogConfig = {
            skin: 'ios',
            backdrop: false,
            content: '您确定要删除此车辆吗？'
        };
        this.dialogService.show(this.dialogConfig).subscribe((res: any) => {
            if (res.value) {
                this.operation(3, item);
            }
        });
        return false;
    }

    operation(type, item) {
        this.baseService.post('editMemberCar', {
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
                if (carList.status.succeed === '1') {
                    if(type === 3) {
                        this.getInitData();
                    }else{
                        // this.carList = carList.data.member_car_list;
                    }
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

}
