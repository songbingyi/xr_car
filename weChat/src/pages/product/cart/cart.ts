import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { BaseProvider } from '../../../providers/http/base.http';
import { IdentityAuthService } from '../../../providers/identityAuth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../providers/custom.validators';
import { Md5 } from '../../../providers/md5/md5';
import { config } from '../../../app/app.config';
import { PopupComponent } from 'ngx-weui/popup';
import { WXSDKService } from '../../../providers/wx.sdk.service';
import { PopupModule } from 'ngx-weui';

// declare const Swiper: any;

@Component({
    selector: 'app-cart',
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {

    errorMessage: any;
    isLoaded: Boolean = false;

    images: any = [];
    product: any = {};

    @ViewChild('full') fullPopup: PopupComponent;
    @ViewChild('fullCity') fullCityPopup: PopupComponent;
    @ViewChild('simple') simplePopup: PopupComponent;

    submitting: boolean = false;

    username = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6)
    ]);
    telephone = new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
    ]);
    carscount = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.min(0)
    ]);
    comment = new FormControl('', [
        Validators.maxLength(200)
    ]);

    orderForm: FormGroup = this.builder.group({
        username: this.username,
        telephone: this.telephone,
        comment: this.comment,
        carscount: this.carscount
    });

    fromError: Boolean = false;

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    wxs: any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    currentCity: any = [];
    regionList: any = [];
    childrenRegionList: any = [];
    selectedRegion: any = {};
    selectedCity: any = {};

    shouldConfirmBox: boolean = true;
    /**@name车辆用途列表 */
    purposeList: any = [];
    /**@name被选择的车辆用途 */
    currentPurpose: any = {};


    constructor(private builder: FormBuilder, private baseService: BaseProvider, private route: ActivatedRoute, private router: Router, private baseProvider: BaseProvider, private identityAuthService: IdentityAuthService, private customValidators: CustomValidators, private wxService: WXSDKService) {
        this.identityAuthService.check();
        this.wxService.init();
    }

    ngOnInit() {

        let id = this.route.snapshot.paramMap.get('id');
        this.baseService.post('getCarProductPurposeList', {})
            .subscribe(PurposeList => {
                if (PurposeList.status.succeed === '1') {
                    this.purposeList = PurposeList.data.car_product_purpose_list;


                } else {
                    this.errorMessage = PurposeList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);

        // this.loadProduct(id);一进入就获取商品信息 暂时注掉
        /*this.routes.paramMap.switchMap((params : ParamMap) => {
            console.log(params.get('id'));
        });*/
        this.getLocation()

    }

    getLocation(callback?) {
        let self = this;
        this.wxService.onGetLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                self.loadCurrentCity();
                console.log('第一次执行getlocation成功')
            },
            fail: () =>{
                setTimeout(() => {
                    self.oGetLocation()
                }, 400);
              console.log('第一次执行getlocation失败')

            }
        });
    }

    oGetLocation() {
        let self = this;
        this.wxService.onGetLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                self.loadCurrentCity();
                console.log('第二次执行getlocation成功')
            },
            fail: ()=>{
                console.log('第二次执行getlocation失败')
                
            }
        });
    }

    // ngAfterContentInit() {
    //     this.wxs.then(res => {
    //         this.getLocation();
    //     });
    // }

    // loadProduct(id) {//一进入就获取商品信息 暂时注掉
    //     this.baseProvider.post('getCarProductDetail', { 'product_id': id }).subscribe(product => {
    //         if (product.status.succeed === '1') {
    //             this.product = product.data.car_product_info;
    //             //this.getImagesList(this.product.product_image_list);
    //             this.isLoaded = true;
    //         } else {
    //             this.errorMessage = product.status.error_desc;
    //         }
    //     }, error => this.errorMessage = <any>error);
    // }

    loadCurrentCity() {
        this.baseProvider.post('getRegionCoordinate', {
            latitude_num: this.latitude,
            longitude_num: this.longitude
        }).subscribe(currentCity => {
            if (currentCity.status.succeed === '1') {
                this.currentCity = currentCity.data.region_info;
                // let region_list = currentCity.data.region_list;
                // this.currentCity = ((region_list[0] && region_list[0].region_name) ? region_list[0].region_name : '') + ((region_list[1] && region_list[1].region_name) ? region_list[1].region_name : '');
                this.isLoaded = true;
            } else {
                this.errorMessage = currentCity.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    loadRegionList() {
        this.baseProvider.post('getRegionList', {
            parent_id: ''
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
        this.baseProvider.post('getRegionList', {
            parent_id: id
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
    /**@name 点击选择车辆用途 */
    selectPurpose() {
        this.simplePopup.show()

    }
    /**@name 选择某个车辆用途 */
    selectCurrentPurpose(item) {
        console.log(item)
        this.simplePopup.close()
        this.currentPurpose = item;

    }


    selectRegion(province) {
        this.selectedRegion = province;
        if (province.has_child) {
            this.selectedCity = {};
            this.loadChildRegionList(province.region_id);
        }
    }
    selectCity(city?) {
        if (city) {
            this.selectedCity = city;
            this.fullCityPopup.close();
            this.fullPopup.close();
        } else {
            if (this.currentCity) {
                this.selectedRegion = {};
                this.selectedCity = this.currentCity;
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
    /**@name 判断提交信息是否合法，合法后弹出提示确认提交 */
    iWangSub(){
        if (this.orderForm.invalid || this.selectedCity.region_id == undefined) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            if (!this.currentPurpose.car_product_purpose_id) {
                this.errorMessage = '请先选择车辆用途！';
                return;
            }
            if (this.orderForm.value.carscount <= 0) {
                this.errorMessage = '请输入购车数量！';
                return;
            }
            if (!this.orderForm.value.username) {
                //this.fromError = true;
                this.errorMessage = '请输入有效的姓名！';
                return;
            }
            if (!this.orderForm.value.telephone) {
                this.errorMessage = '请输入正确的电话！';
                return;
            }
            if (this.selectedCity.region_id == undefined) {
                this.errorMessage = '请先选择地区！';
                return;
            }
            this.errorMessage = '';
            this.fromError = true;

            return;
        } else {
            this.shouldConfirmBox = !this.shouldConfirmBox;
            this.errorMessage = '';
            this.fromError = false;
        }

    }

    iSee() {
        this.shouldConfirmBox = true;
    }


    /**提交订单 */
    orderNow() {
        /*if(!this.orderForm.value.code){
            this.fromError = true;
            this.errorMessage = '请输入有效的验证码！';
            return ;
        }*/

   

        /*if((this.orderForm.value.code && this.orderForm.value.code.length !== 4)){
            //this.fromError = true;
            this.errorMessage = '请输入有效的邀请码！';
            return ;
        }*/

        if (this.orderForm.invalid) {
            // this.errorMessage = '请修改红色错误信息后再提交';
            this.errorMessage = '';
            this.fromError = true;
            return;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }

        if (this.submitting) {
            return;
        }
        //console.log(this.userInfoForm);
        this.submitting = true;

        /*console.log({
            "submit_car_product_order_info": {
                "car_product_info": {
                    "product_id": this.product.product_id,
                    "product_name": this.product.product_name,
                    "price_description": this.product.price_description
                },
                "cards_region_info": {
                    "region_id": this.selectedCity.region_id,
                    "region_name": this.selectedCity.region_name
                },
                "sales_invite_code": this.orderForm.value.code,
                'username' : this.orderForm.value.phone,
            }
        });*/

        this.baseService.post('addCarProductOrder', {
            "submit_car_product_order_info": {
                "car_product_info": {
                    // "product_id": this.product.product_id,
                    // "product_name": this.product.product_name,
                    // "price_description": this.product.price_description
                    "product_id": '',
                    "product_name": '',
                    "price_description": ''
                },
                "cards_region_info": {
                    "region_id": this.selectedCity.region_id,
                    "region_name": this.selectedCity.region_name
                },
                //"sales_invite_code": this.orderForm.value.code,
                'buyer_member_info': {
                    'member_name': this.orderForm.value.username,
                    'mobile': this.orderForm.value.telephone
                },
                'car_product_comment': this.orderForm.value.comment,
                'car_product_purpose_info': this.currentPurpose,
                'car_product_count': this.orderForm.value.carscount.toString()

            }
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    this.orderForm.reset();
                    this.router.navigate(['productOrderComplete', result.data.car_product_order_id]);
                } else {
                    /*if(result.status.error_code === '1012'){
                        this.errorMessage = '验证码不正确，请重新输入！' || result.status.error_desc;
                    }else{
                        this.errorMessage = result.status.error_desc;
                    }*/
                    this.errorMessage = result.status.error_desc;
                }
                this.submitting = false;
                //this.updateForm.dirty = false;
            }, error => this.errorMessage = <any>error);
    }

    count() {
        let comment = this.orderForm.value.comment;
        if (comment) {
            return String(comment).length;
        } else {
            return 0;
        }
    }

}
