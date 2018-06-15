import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseProvider} from '../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {WXSDKService} from '../../providers/wx.sdk.service';


@Component({
    selector: 'app-rescue',
    templateUrl: './rescue.component.html',
    styleUrls: ['./rescue.component.scss']
})
export class RescueComponent implements OnInit {

    MAX_CAR_NUMBER:number = 3;

    member_car_list:any = [];

    errorMessage:any;
    error_code:any;


    result:any = {};

    loaded:boolean = false;

    shouldReservationBox : Boolean = true;
    identityAuth: boolean;

    memberDetail : any;

    wxs:any;

    isNotDone:boolean = true;
    error_desc:boolean = false;


    latitude:any;
    longitude:any;

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private wxService: WXSDKService) {
        this.wxs = this.wxService.init();
        this.wxs.then(res => {
            this.getLocation();
        });
        this.getMemberCarList();
        this.getCarAndMemberInfo();
    }

    ngOnInit() {
    }

    /*showList(type : SkinType = 'ios', style? : 1) {
        (<DialogComponent>this[`${type}AS`]).show().subscribe((res : any) => {
            console.log('type', res);
            if (!res.value) {
                this.errorMessage = '';
            }
        });
        return false;
    }*/

    getCarAndMemberInfo() {
        this.baseService.post('getMemberDetail', {})
            .subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data;
                    // this.shouldReservation = this.memberDetail.member_auth_info.member_auth_status === '0';
                    this.shouldReservationBox = this.memberDetail.member_auth_info.member_auth_status === '1';
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getMemberCarList() {
        this.baseService.post('getMemberCarList', {})
            .subscribe(carList => {
                if (carList.status.succeed === '1') {
                    this.member_car_list = carList.data.member_car_list;
                    this.fillCarList();
                    //this.showList();
                    this.loaded = true;
                } else {
                    this.errorMessage = carList.status.error_desc;
                }
            }, error => {
                this.errorMessage = <any>error;
            });
    }

    fillCarList() {
        /*let car = JSON.parse(JSON.stringify(this.member_car_list[0]));
        car.car_id = "9";
        this.member_car_list.push(car);
        let car2 = JSON.parse(JSON.stringify(this.member_car_list[0]));
        car2.car_id = "999";
        this.member_car_list.push(car2);
        console.log(this.member_car_list);*/
        let length = this.member_car_list.length;
        if(length !== this.MAX_CAR_NUMBER){
            new Array(this.MAX_CAR_NUMBER - length + 1).join(',').split('').forEach(()=>{
                this.member_car_list.push({});
            });
        }
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

    getLocation() {
        this.wxService.onGetLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            }
        });
    }


    save(e) {
        e.stopPropagation();
        if(!this.result.selected){
            this.errorMessage = '请选择要救援的车辆！';
            this.clearError();
            return false;
        }

        if(!this.latitude || !this.longitude){
            this.errorMessage = '未获取到地理信息，请同意获取地理信息或重试！';
            this.clearError();
            return false;
        }
        /*console.log({
            car_id : this.result.selected.car_id,
            latitude_num : this.latitude,
            longitude_num : this.longitude,
        });*/

        this.baseService.post('addWorkSheet', {
            submit_work_sheet_info : {
                car_id : this.result.selected.car_id,
                latitude_num : this.latitude,
                longitude_num : this.longitude,
            }
        }).subscribe(result => {
                if (result.status.succeed === '1') {
                    this.isNotDone = false;
                    this.shouldReservationBox = true;
                    //this.router.navigate(['/rescueDetail', result.data.work_sheet_id]);
                } else {
                    this.error_code = result.status.error_code;
                    if (result.status.error_code === '11009') {
                        setTimeout(() => {
                            this.router.navigate(['/duplicate']);
                        }, 100);
                    }else{
                        this.error_desc = result.status.error_desc;
                    }
                }
            }, error => {
                this.errorMessage = <any>error;
            });

        return false;
    }

    cancel(e) {
        e.stopPropagation();
        this.wxs.then((wx)=>{
            wx.closeWindow();
        });
        return false;
    }

    clearError() {
        setTimeout(()=>{
            this.errorMessage = '';
        },3000);
    }

}
