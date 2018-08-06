import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Validators, FormGroup, FormControl, FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {CustomValidators} from '../../../providers/custom.validators';

import {BaseProvider} from '../../../providers/http/base.http';
import {LocalStorage} from '../../../providers/localStorage';

// import {errorCode} from '../../../assets/data/error.code';
import { DialogService, DialogConfig } from 'ngx-weui/dialog';
import {Location} from '@angular/common';
import {IdentityAuthService} from '../../../providers/identityAuth.service';
import {PopupComponent} from 'ngx-weui/popup';
import {WXSDKService} from '../../../providers/wx.sdk.service';
import {PickerService} from 'ngx-weui/picker';
// import { ToastComponent, ToastService } from 'ngx-weui/toast';


@Component({
    selector: 'app-eboss-info',
    templateUrl: './eboss.html',
    styleUrls: ['./eboss.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EbossComponent implements OnInit {

    @ViewChild('fullArguments') fullArgumentsPopup: PopupComponent;

    dialogConfig: DialogConfig;

    errorMessage: any;

    showDurationType: Boolean = false;
    showBrandType: Boolean = false;
    showAreaType: Boolean = false;


    brandList: any = [];
    selectedBrands: any = [];
    selectedBrandsName: any = '';

    @ViewChild('full') fullPopup: PopupComponent;
    @ViewChild('fullCity') fullCityPopup: PopupComponent;


    identityAuth: boolean;


    submitting:boolean = false;
    sales_years:any;
    selectedSalesYears:any;
    selectedSaleYear:any;
    salesYears:any;


    wxs: any;

    // 默认经纬度，地图中心
    longitude = 108.94075;
    latitude = 34.341568;

    currentCity:any = [];
    regionList:any = [];
    childrenRegionList:any = [];
    selectedRegion:any = {};
    selectedCity:any = {};


    duration = new FormControl('', [
        Validators.required,
        this.customValidators.eq(6)
    ]);
    brand = new FormControl('', [
        Validators.required/*,
        this.customValidators.isChinese*/
    ]);
    area = new FormControl('', [
        Validators.required/*,
        this.customValidators.eq(17)*/
    ]);


    ebossForm: any = this.builder.group({
        duration: this.duration,
        brand: this.brand,
        area: this.area
    });

    result: any = {
        a: {
            valid: true
        },
        b: {
            valid: true
        },
        c: {
            valid: true
        }
    };

    fromError: Boolean = false;

    userAgree    = new FormControl('', [
        Validators.required
    ]);

    constructor(private pickerService: PickerService, private wxService: WXSDKService, private route: ActivatedRoute, private router: Router, private builder: FormBuilder, private customValidators: CustomValidators, private baseService: BaseProvider, private localStorage: LocalStorage, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
        this.wxs = this.wxService.init();
        this.getCarBrandList();
        this.getSalesYearTypeList();
        this.getLocation();
    }

    ngOnInit() {

    }

    ngAfterContentInit(){
        this.wxs.then(res => {
            this.getLocation();
        });
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


    getSalesYearTypeList(){
        this.baseService.post('getSalesYearTypeList', {
            // 'member_id' : '1'
        }).subscribe(result => {
            if (result.status.succeed === '1') {
                let sales_year_type_list = result.data.sales_year_type_list;
                this.sales_years = sales_year_type_list;
                //this.rebuildSalesYearType(sales_year_type_list);
            } else {
                this.errorMessage = result.status.error_desc;
            }
            this.submitting = false;
        }, error => this.errorMessage = <any>error);
    }

    /*rebuildSalesYearType(salesTypeYears) {
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
    }*/


    validators(result) {
        this.errorMessage = '';
        return this.customValidators.isValid(result || this.result);
    }

    showSalesYears(){
        this.errorMessage = '';
        this.showDurationType = !this.showDurationType;
    }
    selectDurationType(){
        if (!this.selectedSalesYears) {
            return;
        }
        this.selectedSaleYear = this.selectedSalesYears;
        /*this.result.a = this.selectedSalesYears;
        this.result.a.valid = true;
        this.validators(this.result);
        this.selectedSalesYears = null;*/
        this.cancelBox();
    }

    showBrandTypeBox() {
        this.errorMessage = '';
        this.showBrandType = !this.showBrandType;
    }

    cancelBox() {
        this.showDurationType = false;
        this.showBrandType = false;
        this.showAreaType = false;
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

    save() {
        //console.log(this.selectedSalesYears);
        //console.log(this.selectedCity);
        //console.log(this.selectedBrands);
        if(!this.selectedSalesYears || (this.selectedSalesYears && !this.selectedSalesYears.sales_year_type_id)){
            this.errorMessage = '请先选择售车年限！';
            return ;
        }

        if(!this.selectedBrands || !this.selectedBrands.length){
            this.errorMessage = '请先选择主卖品牌！';
            return ;
        }

        if(!this.selectedCity || !this.selectedCity.region_id){
            this.errorMessage = '请先选择售车区域！';
            return ;
        }

        if(!this.userAgree.value){
            this.errorMessage = '请先选择同意E老板协议！';
            return ;
        }

        if(this.submitting){
            return;
        }
        //console.log(this.userInfoForm);
        this.submitting = true;
        this.baseService.post('applySalesMan', {
            // 'member_id' : '1',
            'sales_year_type_info' : this.selectedSalesYears,
            'sales_region_info'  : this.selectedCity,
            'sales_car_brand_list' : this.selectedBrands
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
        this.errorMessage = '';
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

    clearError(){
        setTimeout(()=>{
            this.errorMessage = '';
        },2000);
    }
}
