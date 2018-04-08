import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseProvider} from '../../providers/http/base.http';
import {Router} from '@angular/router';
import {LocalStorage} from '../../providers/localStorage';

@Component({
    selector: 'app-illegal',
    templateUrl: './illegal.html',
    styleUrls: ['./illegal.scss'],
    encapsulation : ViewEncapsulation.None
})
export class IllegalComponent implements OnInit {

    errorMessage : any;
    memberDetail : any;
    shouldReservation : Boolean = true;
    shouldReservationBox : Boolean = true;
    cars = [];
    illegal = {};

    shouldLimitTip:Boolean = true;

    constructor(private router : Router, private baseService : BaseProvider, private localStorage: LocalStorage) {
        this.getCarAndMemberInfo();
        this.getMemberCarList();
    }

    ngOnInit() {
    }

    goDetail(car){
        /*let illegals = {
            'status': {
                'succeed': '1'
            },
            'data': {
                'car_info': {
                    'car_info': {
                        'car_id': '52',
                        'province_code_info': {
                            'province_code_id': '24',
                            'province_code_name': '\u9655',
                            'region_info': {
                                'region_id': '610000',
                                'region_name': '\u9655\u897f\u7701'
                            }
                        },
                        'plate_no': 'AV7R18'
                    },
                    'car_illegal_dashboard': {
                        'illegal_count': '1',
                        'illegal_total_price': '200',
                        'illegal_total_score': '6'
                    },
                    'car_illegal_list': [
                        {
                            'illegal_time': '2017-12-22 19:36:52',
                            'illegal_address': '\u9648\u6d77\u516c\u8def\/\u87e0\u9f99\u516c\u8def',
                            'illegal_content': '驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的',
                            'illegal_price': '200',
                            'illegal_score': '6',
                            'illegal_id': '18717228'
                        },
                        {
                            'illegal_time': '2017-12-22 19:36:52',
                            'illegal_address': '\u9648\u6d77\u516c\u8def\/\u87e0\u9f99\u516c\u8def',
                            'illegal_content': '驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的驾驶机动车违反道路交通信号灯通行的',
                            'illegal_price': '200',
                            'illegal_score': '6',
                            'illegal_id': '18717228'
                        },
                        {
                            'illegal_time': '2017-12-22 19:36:52',
                            'illegal_address': '\u9648\u6d77\u516c\u8def\/\u87e0\u9f99\u516c\u8def',
                            'illegal_content': '\u9a7e\u9a76\u673a\u52a8\u8f66\u8fdd\u53cd\u9053\u8def\u4ea4\u901a\u4fe1\u53f7\u706f\u901a\u884c\u7684',
                            'illegal_price': '200',
                            'illegal_score': '6',
                            'illegal_id': '18717228'
                        },
                        {
                            'illegal_time': '2017-12-22 19:36:52',
                            'illegal_address': '\u9648\u6d77\u516c\u8def\/\u87e0\u9f99\u516c\u8def',
                            'illegal_content': '\u9a7e\u9a76\u673a\u52a8\u8f66\u8fdd\u53cd\u9053\u8def\u4ea4\u901a\u4fe1\u53f7\u706f\u901a\u884c\u7684',
                            'illegal_price': '200',
                            'illegal_score': '6',
                            'illegal_id': '18717228'
                        },
                        {
                            'illegal_time': '2017-12-22 19:36:52',
                            'illegal_address': '\u9648\u6d77\u516c\u8def\/\u87e0\u9f99\u516c\u8def',
                            'illegal_content': '\u9a7e\u9a76\u673a\u52a8\u8f66\u8fdd\u53cd\u9053\u8def\u4ea4\u901a\u4fe1\u53f7\u706f\u901a\u884c\u7684',
                            'illegal_price': '200',
                            'illegal_score': '6',
                            'illegal_id': '18717228'
                        }
                    ]
                }
            }
        };*/
        this.baseService.post('getCarIllegalInfo', {car_id:car.car_id})
            .subscribe(illegal => {
                if (illegal.status.succeed === '1') {
                    this.illegal = illegal.data.car_info;
                    this.localStorage.setObject('carIllegalInfo', this.illegal);
                    // this.shouldLimitTip = false;
                    this.router.navigate(['/service_car_regulations', car.car_id]);
                } else {
                    if(illegal.status.error_code === '3025'){
                        this.shouldLimitTip = false;
                    }else{
                        this.errorMessage = illegal.status.error_desc;
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    getMemberCarList() {
        this.baseService.post('getMemberCarList', {})
            .subscribe(cars => {
                if (cars.status.succeed === '1') {
                    this.cars = cars.data.member_car_list;
                } else {
                    this.errorMessage = cars.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getCarAndMemberInfo() {
        this.baseService.post('getMemberDetail', {
            // 'member_id' : '1'
        })
            .subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data;
                    this.shouldReservationBox = this.memberDetail.member_auth_info.member_auth_status === '1';
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    goToUser() {
        if (this.memberDetail.member_auth_info.identity_auth_status === '0') {
            this.router.navigate(['/userInfo']);
            return;
        }
        if (this.memberDetail.member_auth_info.car_auth_status === '0') {
            this.router.navigate(['/carInfo']);
        }
    }

    ok() {
        this.shouldLimitTip = true;
    }

}
