import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorage} from '../../providers/localStorage';

@Component({
    selector: 'app-illegal-detail',
    templateUrl: './illegalDetail.html',
    styleUrls: ['./illegalDetail.scss']
})
export class IllegalDetailComponent implements OnInit {

    illegal:any;
    errorMessage: any;
    loaded: Boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private baseService: BaseProvider, private localStorage: LocalStorage) {
        //let car_id = this.route.snapshot.paramMap.get('id');
        let carIllegalInfo = this.localStorage.getObject('carIllegalInfo');
        this.illegal = carIllegalInfo ? (carIllegalInfo || {}) : {};
        //console.log(this.illegal);
        this.loaded = true;
        this.localStorage.remove('carIllegalInfo');
        //this.getDetail(car_id);
    }

    ngOnInit() {
    }

    getDetail(car_id) {
        this.baseService.post('getCarIllegalInfo', {car_id:car_id})
            .subscribe(illegal => {
                this.loaded = true;
                if (illegal.status.succeed === '1') {
                    this.illegal = illegal.data.car_info;
                } else {
                    this.errorMessage = illegal.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        /*let illegal = {
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
        };
        this.illegal = illegal.data.car_info;
        this.loaded = true;*/
    }

}
