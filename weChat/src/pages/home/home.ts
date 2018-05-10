import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {WXService} from '../../providers/wx.service';

import {BaseProvider} from '../../providers/http/base.http';
import {LocalStorage} from '../../providers/localStorage';

import {ProductsModel} from '../../models/product.model';
import {ProductModel} from '../../models/product.model';

import {InfiniteLoaderComponent} from 'ngx-weui/infiniteloader';

import {Observable} from 'rxjs/Rx';
import {MessageService} from '../../providers/messageService';
import {PickerService} from 'ngx-weui/picker';

@Component({
    selector    : 'app-home',
    templateUrl : './home.html',
    styleUrls   : ['./home.scss'],
    providers   : [BaseProvider]
})
export class HomeComponent implements OnInit {
    pagination= {
        page : 1,
        count: 10
    };
    products : any = [];
    errorMessage : any;
    isLoading : Boolean = false;
    isLoaded : Boolean = false;

    show: Boolean = false;

    serviceTypes: any = [];

    @ViewChild(InfiniteLoaderComponent) il;
    @ViewChild('scrollMe') private myScrollContainer : ElementRef;

    // 选择弹框
    showCarType:boolean = false;
    showCarSeries:boolean = false;
    selectedCarType :any;
    selectedCarSeries :any;

    comp: InfiniteLoaderComponent;

    // mock 数据
    carTypeList: Array<any> = [];
    carSeriesList: Array<any> = [];

    constructor(private baseProvider: BaseProvider, private router : Router, private localStorage: LocalStorage, private message: MessageService, private pickerService: PickerService) {
        this.message.getMessage().subscribe(msg => {
            if(msg.type === 'refresh'){
                this.refresh();
            }
        });
        this.loadCategoryList();
        //this.loadSeriesList();
    }

    status : string;

    ngOnInit() {
        this.baseProvider.post('getServiceTypeList', {})
            .subscribe(serviceTypes => {
                if (serviceTypes.status.succeed === '1') {
                    this.serviceTypes = serviceTypes.data.service_type_list;
                } else {
                    this.errorMessage = serviceTypes.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
        this.loadProducts();
    }

    ngAfterViewInit() {
        // this.bindEvent();
    }

    loadProducts(callbackDone?, callbackOnce?) {
        let where:any = {
            pagination: this.pagination
        };
        let selectedCarSeries = this.selectedCarSeries || {};
        let selectedCarType = this.selectedCarType || {};
        if(selectedCarSeries.car_product_series_id !== '-2' && selectedCarType.car_product_category_id !=='-2'){
            where = {
                pagination: this.pagination,
                filter_value : {
                    car_product_category_info : {
                        car_product_category_id : selectedCarType.car_product_category_id,
                        car_product_category_name : selectedCarType.car_product_category_name
                    },
                    car_product_series_list : {
                        car_product_series_id : selectedCarSeries.car_product_series_id,
                        car_product_series_name : selectedCarSeries.car_product_series_name
                    }
                }
            }
        }
        this.baseProvider.post('getCarProductList', where).subscribe(products => {
                if (products.status.succeed === '1') {
                    console.log(products.data.car_product_list);
                    this.products = this.products.concat(products.data.car_product_list);

                    this.isLoading = false;
                    this.isLoaded = true;

                    this.bindEvent();

                    if ((products.paginated.more === '0') && !!callbackDone) {
                        return callbackDone();
                    }

                    if (callbackOnce) {
                        callbackOnce();
                    }
                } else {
                    this.errorMessage = products.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    loadCategoryList(){
        this.baseProvider.mockGet('getCarProductCategoryList', {}).subscribe(categoryList => {
            if (categoryList.status.succeed === '1') {
                //console.log(categoryList);
                let categoryLists = categoryList.data.car_product_category_list;
                this.rebuildData(categoryLists, 'category');
                this.loadSeriesList(categoryLists[0]);
            } else {
                this.errorMessage = categoryList.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    loadSeriesList(options){
        this.baseProvider.mockGet('getCarProductSeriesList', options).subscribe(seriesList => {
            if (seriesList.status.succeed === '1') {
                //console.log(seriesList);
                let seriesLists = seriesList.data.car_product_series_list;
                this.rebuildData(seriesLists, 'series');
            } else {
                this.errorMessage = seriesList.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    rebuildData(data, keyName) {
        let result = [];
        let label = 'car_product_category_name';
        let value = 'car_product_category_id';
        let dataName = 'carTypeList';
        let labelDefault = '类型';

        let defaultItem:any = {
            label : labelDefault,
            value : '-2',
            car_product_category_name: labelDefault,
            car_product_category_id : '-2'
        };

        if(keyName === 'series'){
            label = 'car_product_series_name';
            value = 'car_product_series_id';
            dataName = 'carSeriesList';
            labelDefault = '系列';

            defaultItem = {
                label : labelDefault,
                value : '-2',
                car_product_series_name: labelDefault,
                car_product_series_id : '-2'
            };

            this.selectedCarSeries = defaultItem;
        }else{
            this.selectedCarType = defaultItem;
        }

        result.push(defaultItem);

        data.forEach(newData => {
            newData.label = newData[label];
            newData.value = newData[value];
            result.push(newData);
        });

        if (data.length) {
            this[dataName] =  [result];
        }else{
            this[dataName] =  [[{
                label : '暂无分类',
                value : '-1',
                disabled: true
            }]];
        }
    }

    refresh() {
        this.pagination.page = 1;
        this.goTop();
        this.loadProducts();
    }

    onLoadMore(comp : InfiniteLoaderComponent) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.pagination.page ++ ;
        this.comp = comp;
        this.loadProducts(() => {
            comp.setFinished();
        }, () => {
            comp.resolveLoading();
        });

    }

    // 类型
    showCarTypePop(){
        if(this.carTypeList.length){
            this.pickerService.show(this.carTypeList, '', [0], {
                type: 'default',
                separator: '|',
                cancel: '取消',
                confirm: '确定',
                backdrop: false
            }).subscribe((res: any) => {
                console.log(res);
                this.selectedCarType = res.items[0];
                //this.selectedCarSeries = null;
                this.loadSeriesList(res.items[0]);
            });
        }
    }
    // 系列
    showCarSeriesPop(){
        if(this.carSeriesList.length){
            this.pickerService.show(this.carSeriesList, '', [0], {
                type: 'default',
                separator: '|',
                cancel: '取消',
                confirm: '确定',
                backdrop: false
            }).subscribe((res: any) => {
                console.log(res);
                this.selectedCarSeries = res.items[0];
                this.onSelectChanged();
            });
        }
    }

    onSelectChanged(){
        // let selectedCarSeries = this.selectedCarSeries ;
        // let selectedCarType = this.selectedCarType;
        this.pagination = {
            page : 1,
            count: 10
        };
        this.products = [];
        this.isLoaded = false;
        this.isLoading = true;
        this.il.restart();
        this.loadProducts();
        /*if(selectedCarSeries && selectedCarType){
            this.pagination = {
                page : 1,
                count: 10
            };
            this.products = [];
            this.loadProducts();
        }*/
    }

    /*cancelCarTypeBox() {
        this.selectedCarType = null;
        this.showCarType = false;
    }
    selectCarType() {

    }
    cancelCarSeriesBox() {
        this.selectedCarSeries = null;
        this.showCarSeries = false;
    }
    selectCarSeries() {

    }*/

    goModule(serviceType) {
        if (serviceType.service_type_status === '1') {
            this.localStorage.setObject(serviceType.service_type_key, serviceType);
            this.router.navigate([serviceType.service_type_key]);
        }
    }

    toCart($event, product) {
        $event.stopPropagation();
        //$event;
        this.router.navigate(['cart', product.product_id], { queryParams: { product_id: product.product_id } });
    }

    goTop() {
        try {
            this.myScrollContainer.nativeElement.scrollIntoView(); // this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    bindEvent() {
        let $body = document.querySelector('body');
        let height = $body.clientHeight || $body.offsetHeight;
        setTimeout(() => {
            let content = document.querySelector('.weui-infiniteloader__content');
             // console.log(content);
            if(content) {
                content.addEventListener('scroll', (event) => {
                    let scrollTop = content.scrollTop;
                    if( scrollTop > height){
                        this.show = true;
                    }else{
                        this.show = false;
                    }
                    // console.log(content.scrollTop);
                });
            }
        },0)
    }

}
