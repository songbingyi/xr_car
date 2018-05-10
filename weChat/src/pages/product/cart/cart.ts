import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';
import {IdentityAuthService} from '../../../providers/identityAuth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../providers/custom.validators';
import {Md5} from '../../../providers/md5/md5';
import {config} from '../../../app/app.config';
import {PopupComponent} from 'ngx-weui/popup';
import {WXSDKService} from '../../../providers/wx.sdk.service';

// declare const Swiper: any;

@Component({
    selector    : 'app-cart',
    templateUrl : './cart.html',
    styleUrls   : ['./cart.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {

    errorMessage: any;
    isLoaded: Boolean = false;

    images: any = [];
    product: any = {};

    @ViewChild('full') fullPopup: PopupComponent;
    @ViewChild('fullCity') fullCityPopup: PopupComponent;

    submitting:boolean = false;

    username = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6)
    ]);
    code   = new FormControl('', []);

    orderForm: FormGroup = this.builder.group({
        username : this.username,
        code     : this.code
    });

    fromError: Boolean = false;

    @ViewChild('scrollMe') private myScrollContainer : ElementRef;

    wxs: any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    currentCity:any = [];
    regionList:any = [];
    childrenRegionList:any = [];
    selectedRegion:any = {};
    selectedCity:any = {};

    constructor(private builder: FormBuilder, private baseService: BaseProvider, private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private identityAuthService:IdentityAuthService, private customValidators: CustomValidators, private wxService: WXSDKService) {
        this.identityAuthService.check();
        this.wxs = this.wxService.init();
    }

    ngOnInit() {

        let id = this.route.snapshot.paramMap.get('id');
        this.loadProduct(id);
        /*this.routes.paramMap.switchMap((params : ParamMap) => {
            console.log(params.get('id'));
        });*/
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

    loadProduct(id) {
        this.baseProvider.post('getCarProductDetail', {'product_id': id}).subscribe(product => {
                if (product.status.succeed === '1') {
                    this.product = product.data.car_product_info;
                    //this.getImagesList(this.product.product_image_list);
                    this.isLoaded = true;
                } else {
                    this.errorMessage = product.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    loadCurrentCity() {
        this.baseProvider.mockGet('getRegionCoordinate', {
            latitude : this.latitude,
            longitude : this.longitude
        }).subscribe(currentCity => {
            if (currentCity.status.succeed === '1') {
                this.currentCity = currentCity.data.region_list;
                // let region_list = currentCity.data.region_list;
                // this.currentCity = ((region_list[0] && region_list[0].region_name) ? region_list[0].region_name : '') + ((region_list[1] && region_list[1].region_name) ? region_list[1].region_name : '');
                this.isLoaded = true;
            } else {
                this.errorMessage = currentCity.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    loadRegionList() {
        this.baseProvider.mockGet('getRegionList', {
            parent_id : ''
        }).subscribe(regionList => {
            if (regionList.status.succeed === '1') {
                console.log(regionList);
                this.regionList = regionList.data.region_list;
                this.fullPopup.show();
            } else {
                this.errorMessage = regionList.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    loadChildRegionList(id) {
        this.baseProvider.mockGet('47-1-getRegionList', {
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
            this.loadChildRegionList(province.region_id);
        }
    }
    selectCity(city?) {
        if(city){
            this.selectedCity = city;
            this.fullCityPopup.close();
            this.fullPopup.close();
        }else{
            if(this.currentCity[0] && this.currentCity[1]){
                this.selectedRegion = this.currentCity[0];
                this.selectedCity   = this.currentCity[1];
            }
            this.fullPopup.close();
        }

    }

    goTop() {
        try {
            this.myScrollContainer.nativeElement.scrollIntoView(); // this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    orderNow() {
        /*if(!this.orderForm.value.code){
            this.fromError = true;
            this.errorMessage = '请输入有效的验证码！';
            return ;
        }*/

        if(!this.orderForm.value.username){
            //this.fromError = true;
            this.errorMessage = '请输入有效的姓名！';
            return ;
        }

        if(!this.selectedRegion.region_id || !this.selectedCity.region_id){
            this.errorMessage = '请先选择地区！';
            return ;
        }

        if((this.orderForm.value.code && this.orderForm.value.code.length !== 6)){
            //this.fromError = true;
            this.errorMessage = '请输入有效的邀请码！';
            return ;
        }

        if (this.orderForm.invalid) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            this.errorMessage = '';
            this.fromError = true;
            return ;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }

        if(this.submitting){
            return;
        }
        //console.log(this.userInfoForm);
        this.submitting = true;

        console.log({
            'username' : this.orderForm.value.username,
            'code' : this.orderForm.value.code,
            'region' : this.selectedRegion,
            'city' : this.selectedCity
        });
        this.submitting = false;

        /*this.baseService.post('order', {
            // 'member_id' : '1',
            'username' : this.orderForm.value.phone,
            'code' : this.orderForm.value.code
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    this.orderForm.reset();
                } else {
                    if(result.status.error_code === '1012'){
                        this.errorMessage = '验证码不正确，请重新输入！' || result.status.error_desc;
                    }else{
                        this.errorMessage = result.status.error_desc;
                    }
                }
                this.submitting = false;
                //this.updateForm.dirty = false;
            }, error => this.errorMessage = <any>error);*/
    }

}
