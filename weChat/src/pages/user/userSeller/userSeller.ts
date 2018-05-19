import {Component, OnInit, NgZone, ElementRef, ViewChild} from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { LocalStorage } from '../../../providers/localStorage';
import { Md5 } from '../../../providers/md5/md5';

import { CustomValidators } from '../../../providers/custom.validators';
import { BaseProvider } from '../../../providers/http/base.http';

import { config } from '../../../app/app.config';
import {IdentityAuthService} from '../../../providers/identityAuth.service';
import {PopupComponent} from 'ngx-weui/popup';
import {WXSDKService} from '../../../providers/wx.sdk.service';
import {PickerService} from 'ngx-weui/picker';
import {Location} from '@angular/common';
import {Router} from '@angular/router';


@Component({
    selector    : 'app-user-seller',
    templateUrl : './userSeller.html',
    styleUrls   : ['./userSeller.scss']
})
export class UserSellerComponent implements OnInit {
    isModifying: boolean = false;

    errorMessage: any;
    memberDetail: any;
    identityAuthStatus: boolean = true;
    submitting:boolean = false;
    identityAuth: boolean;

    sales_years:any;
    selectedSalesYears:any;
    salesYears:any;


    @ViewChild('full') fullPopup: PopupComponent;
    @ViewChild('fullCity') fullCityPopup: PopupComponent;
    @ViewChild('fullArguments') fullArgumentsPopup: PopupComponent;

    wxs: any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    currentCity:any = [];
    regionList:any = [];
    childrenRegionList:any = [];
    selectedRegion:any = {};
    selectedCity:any = {};

    userAgree    = new FormControl('', [
        Validators.required
    ]);

    constructor(private router : Router, private builder: FormBuilder, private baseService: BaseProvider, private customValidators: CustomValidators, private localStorage: LocalStorage, private zone: NgZone, private identityAuthService:IdentityAuthService, private wxService: WXSDKService, private pickerService: PickerService, private location: Location) {
        this.identityAuthService.check();
        this.wxs = this.wxService.init();
        this.getCarAndMemberInfo();
        this.getSalesYearList();
        this.identityAuth = config.identityAuth;
    }

    getCarAndMemberInfo() {
        this.baseService.post('getMemberDetail', {
            // 'member_id' : '1'
        }).subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data;
                    this.identityAuthStatus = false;//this.memberDetail.member_auth_info.identity_auth_status !== '0';
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getLocation(callback?) {
        let self = this;
        this.wxService.onGetLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                self.loadCurrentCity();
            }
        });
    }

    ngAfterContentInit(){
        this.wxs.then(res => {
            this.getLocation();
        });
    }

    save() {
        if(!this.selectedSalesYears || (this.selectedSalesYears &&!this.selectedSalesYears.sales_year_value)){
            this.errorMessage = '请先选择从业时长！';
            return ;
        }
        if(!this.selectedCity.region_id){
            this.errorMessage = '请先选择所属地区！';
            return ;
        }

        if(!this.userAgree.value){
            this.errorMessage = '请先选择销售员协议！';
            return ;
        }

        if(this.submitting){
            return;
        }
        //console.log(this.userInfoForm);
        this.submitting = true;
        this.baseService.post('applySalesMan', {
            // 'member_id' : '1',
            'sales_years' : this.selectedSalesYears.sales_year_value,
            'sales_region_info'  : this.selectedCity
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    //this.location.back();
                    this.router.navigate(['/success']);
                } else {
                    this.errorMessage = result.status.error_desc;
                }
                this.submitting = false;
            }, error => this.errorMessage = <any>error);
    }

    getSalesYearList(){
        this.baseService.post('getSalesYearList', {
            // 'member_id' : '1'
        }).subscribe(result => {
                if (result.status.succeed === '1') {
                    let sales_year_list = result.data.sales_year_list;
                    this.rebuildSalesYear(sales_year_list);
                } else {
                    this.errorMessage = result.status.error_desc;
                }
                this.submitting = false;
            }, error => this.errorMessage = <any>error);
    }

    rebuildSalesYear(salesYears) {
        let result = [];
        salesYears.forEach(saleYear => {
            saleYear.label = saleYear.sales_year_name;
            saleYear.value = saleYear.sales_year_value;
            result.push(saleYear);
        });

        if (salesYears.length) {
            this.salesYears =  [result];
        }else{
            this.salesYears =  [[{
                label : '没有年限可以选择',
                value : '-1',
                disabled: true
            }]];
        }
    }

    showSalesYears() {
        this.pickerService.show(this.salesYears, '', [0], {
            type: 'default',
            separator: '|',
            cancel: '取消',
            confirm: '确定',
            backdrop: false
        }).subscribe((res: any) => {
            //console.log(res);
            this.selectedSalesYears = res.items[0];
            //this.onSalesYearsChanged(res.items[0]);
        });
    }

    /*onSalesYearsChanged(item){

    }*/

    loadCurrentCity() {
        this.baseService.mockGet('getRegionCoordinate', {
            latitude : this.latitude,
            longitude : this.longitude
        }).subscribe(currentCity => {
            if (currentCity.status.succeed === '1') {
                this.currentCity = currentCity.data.region_info;
                // let region_list = currentCity.data.region_list;
                // this.currentCity = ((region_list[0] && region_list[0].region_name) ? region_list[0].region_name : '') + ((region_list[1] && region_list[1].region_name) ? region_list[1].region_name : '');
            } else {
                this.errorMessage = currentCity.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    loadRegionList() {
        this.baseService.post('getRegionList', {
            parent_id : ''
        }).subscribe(regionList => {
            if (regionList.status.succeed === '1') {
                //console.log(regionList);
                this.regionList = regionList.data.region_list;
                this.fullPopup.show();
            } else {
                this.errorMessage = regionList.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    loadChildRegionList(id) {
        this.baseService.post('getRegionList', {
            parent_id : id
        }).subscribe(regionList => {
            if (regionList.status.succeed === '1') {
                this.childrenRegionList = regionList.data.region_list;
                this.fullCityPopup.show();
            } else {
                this.errorMessage = regionList.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    selectArea() {
        this.loadRegionList();
    }

    selectRegion(province) {
        this.selectedRegion = province;
        if(province.has_child){
            this.selectedCity = {};
            this.loadChildRegionList(province.region_id);
        }
    }
    selectCity(city?) {
        if(city){
            this.selectedCity = city;
            this.fullCityPopup.close();
            this.fullPopup.close();
        }else{
            if(this.currentCity){
                this.selectedRegion = {};
                this.selectedCity   = this.currentCity;
            }
            this.fullPopup.close();
        }

    }

    ngOnInit() {
    }
}
