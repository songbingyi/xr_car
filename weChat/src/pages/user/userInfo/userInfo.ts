import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { PopupComponent } from "ngx-weui/popup";

import { LocalStorage } from '../../../providers/localStorage';
import { Md5 } from '../../../providers/md5/md5';

import { CustomValidators } from '../../../providers/custom.validators';
import { BaseProvider } from '../../../providers/http/base.http';

import { config } from '../../../app/app.config';
import {IdentityAuthService} from '../../../providers/identityAuth.service';
import {Location} from '@angular/common';
import {PickerService} from 'ngx-weui/picker';
import {WXSDKService} from '../../../providers/wx.sdk.service';
import {Router} from '@angular/router';


@Component({
    selector    : 'app-user-info',
    templateUrl : './userInfo.html',
    styleUrls   : ['./userInfo.scss']
})
export class UserInfoComponent implements OnInit {
    hasPhone : boolean = false;
    isModifying: boolean = false;
    verifyCode: any;

    @ViewChild('fullArguments') fullArgumentsPopup: PopupComponent;

    timeOut = 60;
    timing: boolean = false;

    errorMessage: any;
    memberDetail: any;
    identityAuthStatus: boolean = true;

    submitting:boolean = false;

    username = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6)
    ]);
    /*userId   = new FormControl('', [
        Validators.required,
        this.customValidators.eq(18)
    ]);*/
    phone    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    vcode    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);
    userAgree    = new FormControl('', [
        Validators.required
    ]);

    // 选填内容
    companyName    = new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);
    position    = new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);
    companyAdd    = new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);
    email    = new FormControl('', [
        this.customValidators.isEmail,
        Validators.maxLength(30)
    ]);

    updatePhone    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(11),
        this.customValidators.isNumber
    ]);
    updateVcode    = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);


    // 选填内容编辑
    // 选填内容
    updateCompanyName    = new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);
    updatePosition    = new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);
    updateCompanyAdd    = new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(30)
    ]);
    updateEmail    = new FormControl('', [
        this.customValidators.isEmail,
        Validators.maxLength(30)
    ]);

    userInfoForm: FormGroup = this.builder.group({
        username: this.username,
        //userId: this.userId,
        phone: this.phone,
        vcode: this.vcode,
        companyName  : this.companyName,
        position     : this.position,
        companyAdd   : this.companyAdd,
        email        : this.email
    });

    updateForm: FormGroup = this.builder.group({
        phone : this.updatePhone,
        vcode : this.updateVcode,
        companyName: this.updateCompanyName,
        position: this.updatePosition,
        companyAdd: this.updateCompanyAdd,
        email: this.updateEmail
    });

    fromError: Boolean = false;

    identityAuth: boolean;

    sales_years:any;
    selectedSalesYears:any;
    salesYears:any;
    salesYearList = [];

    brands = [];
    brandList = [];
    selectedBrands:any= {};

    @ViewChild('full') fullPopup: PopupComponent;
    @ViewChild('fullCity') fullCityPopup: PopupComponent;

    wxs: any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    currentCity:any = [];
    regionList:any = [];
    childrenRegionList:any = [];
    selectedRegion:any = {};
    selectedCity:any = {};

    showBrandType:boolean = false;
    selectedBrandsName:any = '';

    role_ids:any = [];

    constructor(private router : Router,private builder: FormBuilder, private baseService: BaseProvider, private customValidators: CustomValidators, private localStorage: LocalStorage, private zone: NgZone, private identityAuthService:IdentityAuthService, private wxService: WXSDKService, private pickerService: PickerService, private location: Location) {
        this.getCarAndMemberInfo();
        this.wxs = this.wxService.init();
        this.getSalesYearTypeList();
        this.getCarBrandList();
        this.identityAuth = config.identityAuth;
    }

    getCarAndMemberInfo() {
        this.baseService.post('getMemberDetail', {
            // 'member_id' : '1'
        })
            .subscribe(memberDetail => {
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data || {};
                    /*this.memberDetail.member_role_list = [
                        {
                            "member_role_id": "1",
                            "member_role_name": "普通会员"
                        },
                        {
                            "member_role_id": "2",
                            "member_role_name": "销售员"
                        },
                        {
                            "member_role_id": "3",
                            "member_role_name": "办事处人员"
                        },
                        {
                            "member_role_id": "4",
                            "member_role_name": "经销商人员"
                        }
                    ];*/
                    this.getRoleIds();
                    this.identityAuthStatus = this.memberDetail.member_auth_info.identity_auth_status !== '0';
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getCarBrandList() {
        this.baseService.post('getCarBrandList', {})
            .subscribe(brandList => {
                if (brandList.status.succeed === '1') {
                    this.brandList = brandList.data.car_brand_list;
                } else {
                    this.errorMessage = brandList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getRoleIds(){
        let memberRoleList = this.memberDetail.member_role_list || [];
        this.role_ids = [];
        memberRoleList.forEach(role=>{
            this.role_ids.push(role.member_role_id);
        });
    }

    isRole(role){
        return this.role_ids.indexOf(role) > -1;
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
        //let userId = this.userInfoForm.value.userId;
        let mobile = this.userInfoForm.value.phone;
        // let regxU15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        //let regxU18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        let regxM = (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);

        // 身份证号格式验证
        /*if(userId && (/!*!regxU15.test(userId) && *!/!regxU18.test(userId))){
            this.errorMessage = '身份证号格式不正确';
            return ;
        }*/

        // 手机号格式验证
        if(mobile && ((mobile + '')[0] !== '1')){
            this.errorMessage = '手机号格式不正确';
            return ;
        }

        if(!this.verifyCode || !this.verifyCode.code){
            this.fromError = true;
            this.errorMessage = '请先获取验证码再提交！';
            return ;
        }

        if(!this.userInfoForm.value.vcode){
            this.fromError = true;
            this.errorMessage = '请输入有效的验证码！';
            return ;
        }

        if(this.verifyCode && this.verifyCode.verify_code && this.userInfoForm.value.vcode && (this.verifyCode.verify_code !== this.userInfoForm.value.vcode)){
            //this.fromError = true;
            this.errorMessage = '输入的验证码不正确！';
            return ;
        }

        if(this.userAgree && !this.userAgree.value){
            this.errorMessage = '请先同意用户协议！';
            return ;
        }

        if(!this.canSubmit('userInfoForm')){
            return ;
        }

        if (this.userInfoForm.invalid) {
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
        this.baseService.post('editMemberInfo', {
            // 'member_id' : '1',
            'mobile'         : this.userInfoForm.value.phone,
            'real_name'      : this.userInfoForm.value.username,
            //'id_number'      : this.userInfoForm.value.userId,
            'verify_code'    : Md5.hashStr(this.verifyCode.code + config.salt_key),
            'company_name'   : this.userInfoForm.value.companyName,
            'job_position'   : this.userInfoForm.value.position,
            'company_address': this.userInfoForm.value.companyAdd,
            'email'          : this.userInfoForm.value.email
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    this.isModifying = false;
                    if(config.identityAuth){
                        this.router.navigate(['/success']);
                        //this.identityAuthService.goHome();
                    }else{
                        this.router.navigate(['/success']);
                        /*this.getCarAndMemberInfo();
                        this.userInfoForm.controls.phone.setValue('');
                        this.userInfoForm.controls.username.setValue('');
                        this.userInfoForm.controls.userId.setValue('');
                        this.userInfoForm.controls.vcode.setValue('');
                        this.userInfoForm.controls.companyName.setValue('');
                        this.userInfoForm.controls.position.setValue('');
                        this.userInfoForm.controls.companyAdd.setValue('');
                        this.userInfoForm.controls.email.setValue('');*/
                    }
                } else {
                    if(result.status.error_code === '1012'){
                        this.errorMessage = '验证码不正确，请重新输入！' || result.status.error_desc;
                        return;
                    }
                    this.errorMessage = result.status.error_desc;
                }
                this.submitting = false;
                this.router.navigate(['/success']);
            }, error => this.errorMessage = <any>error);
    }

    modify() {
        this.isModifying = !this.isModifying;
        this.updateForm.controls.phone.setValue(this.memberDetail.member_info.mobile);
        this.updateForm.controls.companyName.setValue(this.memberDetail.member_info.company_name);
        this.updateForm.controls.position.setValue(this.memberDetail.member_info.job_position);
        this.updateForm.controls.companyAdd.setValue(this.memberDetail.member_info.company_address);
        this.updateForm.controls.email.setValue(this.memberDetail.member_info.email);

        this.selectedCity = this.memberDetail.member_info.sales_region_info || {};

        let brandList = this.memberDetail.member_info.sales_car_brand_list || [];
        console.log(brandList);
        console.log(this.brandList);
        this.brandList.forEach((brand)=>{
            brandList.forEach((item)=>{
                if(brand.car_brand_id === item.car_brand_id){
                    brand.checked = true;
                }
            });
        });
        this.selectBrandType();

        let salesYearList = this.salesYears[0] || [];
        let length = salesYearList.length;
        //console.log(salesYearList);
        //console.log(this.memberDetail.member_info.sales_year_type_info);
        for(let i=0; i < length; i++){
            if(salesYearList[i].sales_year_type_id === this.memberDetail.member_info.sales_year_type_info.sales_year_type_id){
                this.selectedSalesYears = salesYearList[i];
                //console.log(this.selectedSalesYears);
                return ;
            }
        }
    }

    update() {
        if (this.updateForm.invalid) {
            this.errorMessage = '';
            this.fromError = true;
            return ;
        } else {
            this.errorMessage = '';
            this.fromError = false;
        }

        if(!this.verifyCode || !this.verifyCode.code){
            this.fromError = true;
            this.errorMessage = '请先获取验证码再提交！';
            return ;
        }

        if(!this.updateForm.value.vcode){
            this.fromError = true;
            this.errorMessage = '请输入有效的验证码！';
            return ;
        }

        if(this.verifyCode && this.verifyCode.verify_code && this.updateForm.value.vcode && (this.verifyCode.verify_code !== this.updateForm.value.vcode)){
            this.errorMessage = '输入的验证码不正确！';
            return ;
        }

        // 只有 role 是 2 的才会编辑销售信息。role:2 销售员
        if(this.isRole('2') && (!this.selectedSalesYears || (this.selectedSalesYears && !this.selectedSalesYears.sales_year_type_id))){
            this.errorMessage = '请先选择从业时长！';
            return ;
        }
        if(this.isRole('2') && (!this.selectedCity || !this.selectedCity.region_id)){
            this.errorMessage = '请先选择所属地区！';
            return ;
        }
        if(this.isRole('2') && (!this.selectedBrands || this.selectedBrands && !this.selectedBrands.length)){
            this.errorMessage = '请先选择主卖品牌！';
            return ;
        }

        if(!this.canSubmit('updateForm')){
            return ;
        }

        if(this.submitting){
            return;
        }
        this.submitting = true;
        /*console.log({
            // 'member_id' : '1',
            'mobile' : this.updateForm.value.phone,
            'verify_code' : Md5.hashStr(this.verifyCode.code + config.salt_key),
            'company_name'   : this.updateForm.value.companyName,
            'job_position'   : this.updateForm.value.position,
            'company_address': this.updateForm.value.companyAdd,
            'email'          : this.updateForm.value.email
        });*/
        this.baseService.post('editMemberInfo', {
            // 'member_id' : '1',
            'mobile' : this.updateForm.value.phone,
            'verify_code' : Md5.hashStr(this.verifyCode.code + config.salt_key),
            'company_name'   : this.updateForm.value.companyName,
            'job_position'   : this.updateForm.value.position,
            'company_address': this.updateForm.value.companyAdd,
            'email'          : this.updateForm.value.email,
            'sales_year_type_info'    : (this.isRole('2') && this.selectedSalesYears) ? this.selectedSalesYears : {},
            'sales_region_info'  : this.isRole('2') ? this.selectedCity : {},
            'sales_car_brand_list'  : this.selectedBrands
        })
            .subscribe(result => {
                if (result.status.succeed === '1') {
                    this.router.navigate(['/success']);
                    this.timeOut = 60;
                    this.timing = false;
                    this.isModifying = false;
                    this.updateForm.controls.phone.setValue('');
                    this.updateForm.controls.vcode.setValue('');
                    this.updateForm.controls.companyName.setValue('');
                    this.updateForm.controls.position.setValue('');
                    this.updateForm.controls.companyAdd.setValue('');
                    this.updateForm.controls.email.setValue('');
                    this.selectedSalesYears = null;
                    this.selectedCity = {};
                    this.updateForm.reset();
                    this.getCarAndMemberInfo();
                } else {
                    if(result.status.error_code === '1012'){
                        this.errorMessage = '验证码不正确，请重新输入！' || result.status.error_desc;
                    }else{
                        this.errorMessage = result.status.error_desc;
                    }
                }
                this.submitting = false;
            }, error => this.errorMessage = <any>error);
    }

    getVCode() {
        let phone = this.userInfoForm.value.phone;
        let regxM = (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);

        if (this.isModifying) {
            phone = this.updateForm.value.phone;
        }

        // 手机号格式验证
        if(phone && ((phone + '')[0] !== '1')){
            this.errorMessage = '手机号格式不正确';
            return ;
        }

        if (!phone) {
            this.errorMessage = '手机号码为必填项！';
            return ;
        } else {
            this.errorMessage = '';
        }

        this.baseService.post('getVerifyCode', {
            'mobile' : phone,
            'code' : Md5.hashStr(phone + '' + config.salt_key)
        })
            .subscribe(verifyCode => {
                if (verifyCode.status.succeed === '1') {
                    this.verifyCode = verifyCode.data;
                    this.timeOut = 60;
                    this.timing = true;
                    this.timeLeft();
                } else {
                    this.errorMessage = verifyCode.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    timeLeft() {
        if (this.timeOut > 0) {
            this.timeOut --;
            this.timing = true;
            setTimeout(() => { this.timeLeft(); }, 1000);
        } else {
            this.timing = false;
        }
    }

    getSalesYearTypeList(){
        this.baseService.post('getSalesYearTypeList', {
            // 'member_id' : '1'
        }).subscribe(result => {
            if (result.status.succeed === '1') {
                let sales_year_type_list = result.data.sales_year_type_list;
                this.rebuildSalesYearType(sales_year_type_list);
            } else {
                this.errorMessage = result.status.error_desc;
            }
            this.submitting = false;
        }, error => this.errorMessage = <any>error);
    }

    rebuildSalesYearType(salesTypeYears) {
        let result = [];
        salesTypeYears.forEach(saleYear => {
            saleYear.label = saleYear.sales_year_type_name;
            saleYear.value = saleYear.sales_year_type_id;
            result.push(saleYear);
        });

        if (salesTypeYears.length) {
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
        this.errorMessage = null;
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

    showBrand(){
        this.showBrandType = !this.showBrandType;
    }

    cancelBox() {
        this.showBrandType = false;
    }

    toggleChecked($event, brand){
        $event.stopPropagation();
        let selectedBrands = this.brandList.filter((brand)=>{
            return brand.checked;
        });
        if(!brand.checked && selectedBrands.length > 1){
            this.errorMessage = '最多只可选择两个品牌！';
            this.clearError();
            $event.preventDefault();
            return;
        }
        brand.checked = !brand.checked;

    }
    selectBrandType() {
        this.selectedBrands = this.brandList.filter((brand)=>{
            return brand.checked;
        });
        console.log(this.selectedBrands);
        let selectedBrandsName = [];
        this.selectedBrands.forEach(brand=>{
            selectedBrandsName.push(brand.car_brand_name);
        });
        this.selectedBrandsName = selectedBrandsName.join(" ");
        this.cancelBox();
    }

    /*onSalesYearsChanged(item){

    }*/

    loadCurrentCity() {
        this.baseService.post('getRegionCoordinate', {
            latitude_num : this.latitude,
            longitude_num : this.longitude
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
        this.errorMessage = null;
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

    changed(type, form, length?){
        length = length || 30;
        let email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        let keys = ['companyName', 'position', 'companyAdd', 'email'];
        let types = {
            'companyName':'公司名称超过30个字，请重新填写！',
            'position':'职位超过30个字，请重新填写！',
            'companyAdd':'公司地址超过30个字，请重新填写！',
            'email':'邮箱格式错误，请检查，重新填写！'
        };
        let value = this[form].value[type];
        if(type === 'email'){
            if(value){
                if(!email.test(value)){
                    this.errorMessage = types.email;
                }else{
                    this.errorMessage = '';
                }
            }else{
                this.errorMessage = '';
            }
        }else{
            if(value && value.length > length){
                this.errorMessage = types[type];
            }else{
                this.errorMessage = '';
            }
        }

    }

    canSubmit(form){
        let length = 30;
        let email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        let keys = ['companyName', 'position', 'companyAdd', 'email'];
        let types = {
            'companyName':'公司名称超过30个字，请重新填写！',
            'position':'职位超过30个字，请重新填写！',
            'companyAdd':'公司地址超过30个字，请重新填写！',
            'email':'邮箱格式错误，请检查，重新填写！'
        };
        let canSubmit = true;
        for(let key in types){
            let value = this[form].value[key];
            if(key === 'email'){
                if(value){
                    if(!email.test(value)){
                        this.errorMessage = types.email;
                        canSubmit = false;
                    }
                }
            }else{
                if(value && value.length > length){
                    canSubmit = false;
                }
            }
        }
        return canSubmit;
    }

    getBrandList(){
        let salesCarBrandList = this.memberDetail && this.memberDetail.member_info && this.memberDetail.member_info.sales_car_brand_list || [];
        let result = [] ;
        salesCarBrandList.forEach((item)=>{
           result.push(item.car_brand_name);
        });
        return result.join(" ");
    }

    ngOnInit() {
    }

    clearError(){
        setTimeout(()=>{
            this.errorMessage = '';
        },2000);
    }
}
