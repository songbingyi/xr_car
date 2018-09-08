import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { WXService } from '../../providers/wx.service';

import { BaseProvider } from '../../providers/http/base.http';
import { LocalStorage } from '../../providers/localStorage';

import { ProductsModel } from '../../models/product.model';
import { ProductModel } from '../../models/product.model';

import { InfiniteLoaderComponent } from 'ngx-weui/infiniteloader';
import { IdentityAuthService } from '../../providers/identityAuth.service';

import { Observable } from 'rxjs/Rx';
import { MessageService } from '../../providers/messageService';
import { PickerService } from 'ngx-weui/picker';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    styleUrls: ['./home.scss'],
    providers: [BaseProvider]
})
export class HomeComponent implements OnInit {
    pagination = {
        page: 1,
        count: 10
    };
    products: any = [];
    errorMessage: any;
    isLoading: Boolean = false;
    isLoaded: Boolean = false;

    show: Boolean = false;

    serviceTypes: any;

    @ViewChild(InfiniteLoaderComponent) il;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    // 选择弹框
    showCarType: boolean = false;
    showCarSeries: boolean = false;

    selectedCarSeries: any;

    comp: InfiniteLoaderComponent;

    // mock 数据
    carTypeList: Array<any> = [];
    carSeriesList: Array<any> = [];

    /**@name 路由catch进来的商品分类ID和name*/
    categoryInfo: any;
    /**@name 商品分类列表*/
    seriesLists: Array<any> = [];
    /**@name 被选中的系列 */
    currentSeries: any;
    /**@name 进入页面初始ID */
    seriesId:string = '1'
    /**@name 是否出现加入销售员通知*/
    wechatClientConfig: any;
    /**@name 隐藏销售员通知控制器*/
    shouldShowWarningBox: Boolean = true;

    /**@name 用户信息 */
    memberDetail: any = {};
    role_ids: any = [];


    constructor(private baseProvider: BaseProvider, private router: Router, private localStorage: LocalStorage, private message: MessageService, private pickerService: PickerService, private routeInfo: ActivatedRoute, private identityAuthService: IdentityAuthService) {
        this.message.getMessage().subscribe(msg => {
            if (msg.type === 'refresh') {
                this.refresh();
            }
        });
        // this.loadCategoryList();
        this.getWechatClientConfig();
        // identityAuthService.check();

    }

    status: string;

    ngOnInit() {
        // this.baseProvider.post('getServiceTypeList', {})
        //     .subscribe(serviceTypes => {
        //         if (serviceTypes.status.succeed === '1') {
        //             this.serviceTypes = serviceTypes.data.service_type_list;
        //         } else {
        //             this.errorMessage = serviceTypes.status.error_desc;
        //         }
        //     }, error => this.errorMessage = <any>error);
        // this.categoryId = this.routeInfo.snapshot.paramMap.get('id');
        // console.log(this.categoryId)
        this.routeInfo.params.subscribe(params => {
            this.categoryInfo = params;
        });
        this.loadSeriesList();
        this.getWechatClientConfig()
        this.getMemberDetail()
    }
    /**@name 选择某个系列 */
    selectedSeries(item) {
        this.currentSeries = item;
        console.log(this.currentSeries)
        this.onSelectChanged()
    }
    /**@name 根据商品分类get系列列表 */
    loadSeriesList() {
        this.baseProvider.post('getCarProductSeriesList', { 'car_product_category_id': this.categoryInfo.id })
            .subscribe(seriesList => {
                if (seriesList.status.succeed === '1') {
                    console.log(seriesList);
                    let oSeriesLists = seriesList.data.car_product_series_list;
                    oSeriesLists.unshift(0);
                    oSeriesLists[0] = { car_product_series_name: '全部' }
                    this.seriesLists = oSeriesLists;
                    this.currentSeries = this.seriesLists[0];//进来默认选中全部
                    // this.rebuildData(seriesLists, 'series');
                    this.loadProducts();
                } else {
                    this.errorMessage = seriesList.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }


    ngAfterViewInit() {
        // this.bindEvent();
    }
    /**@name 获取商品列表 */
    loadProducts(callbackDone?, callbackOnce?) {
        let where = {
            pagination: this.pagination,
            filter_value: {
                car_product_category_info: {
                    car_product_category_id: this.categoryInfo.id,
                    car_product_category_name: this.categoryInfo.name
                },
                car_product_series_info: {
                    car_product_series_id: this.currentSeries ? this.currentSeries.car_product_series_id : '',
                    car_product_series_name: this.currentSeries ? this.currentSeries.car_product_series_name : ''
                }
            }
        }
        console.log('this.pagination',this.pagination)
        this.baseProvider.post('getCarProductList', where).subscribe(products => {
            if (products.status.succeed === '1') {
                // console.log(products.data.car_product_list);
                this.products = this.products.concat(products.data.car_product_list);
                // this.products = products.data.car_product_list

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
    /**@name 获取基本信息 */
    getWechatClientConfig() {
        this.baseProvider.post('getWechatClientConfig', {}).subscribe(wechatClientConfig => {
            if (wechatClientConfig.status.succeed === '1') {
                this.wechatClientConfig = wechatClientConfig.data.wechat_client_config;
                //this.wechatClientConfig.is_tips_join_user_salesman = '1';
                //this.shouldShowWarningBox = wechatClientConfig.data.wechat_client_config.is_tips_join_user_salesman !== '1';
            } else {
                this.errorMessage = wechatClientConfig.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    // loadProducts(callbackDone?, callbackOnce?) {
    //     //console.log("loadProducts");
    //     let where:any = {
    //         pagination: this.pagination
    //     };
    //     let selectedCarSeries = this.selectedCarSeries || {};
    //     let selectedCarType   = this.selectedCarType || {};
    //     if(selectedCarSeries.car_product_series_id || selectedCarType.car_product_category_id){
    //         where = {
    //             pagination: this.pagination,
    //             filter_value : {
    //                 car_product_category_info : {
    //                     car_product_category_id   : selectedCarType.car_product_category_id,
    //                     car_product_category_name : selectedCarType.car_product_category_name
    //                 },
    //                 car_product_series_info : {
    //                     car_product_series_id   : selectedCarSeries.car_product_series_id,
    //                     car_product_series_name : selectedCarSeries.car_product_series_name
    //                 }
    //             }
    //         }
    //     }
    //     this.baseProvider.post('getCarProductList', where).subscribe(products => {
    //             if (products.status.succeed === '1') {
    //                 // console.log(products.data.car_product_list);
    //                 this.products = this.products.concat(products.data.car_product_list);

    //                 this.isLoading = false;
    //                 this.isLoaded = true;

    //                 this.bindEvent();

    //                 if ((products.paginated.more === '0') && !!callbackDone) {
    //                     return callbackDone();
    //                 }

    //                 if (callbackOnce) {
    //                     callbackOnce();
    //                 }
    //             } else {
    //                 this.errorMessage = products.status.error_desc;
    //             }
    //         },
    //         error => this.errorMessage = <any>error
    //     );
    // }

    // loadCategoryList(){
    //     this.baseProvider.post('getCarProductCategoryList', {

    //     }).subscribe(categoryList => {
    //         if (categoryList.status.succeed === '1') {
    //             //console.log(categoryList);
    //             let categoryLists = categoryList.data.car_product_category_list;
    //             this.rebuildData(categoryLists, 'category');
    //             //this.loadSeriesList(categoryLists[0]);
    //         } else {
    //             this.errorMessage = categoryList.status.error_desc;
    //         }
    //     }, error => this.errorMessage = <any>error);
    // }

    // loadSeriesList(options?){
    //     options = options || {};
    //     this.baseProvider.post('getCarProductSeriesList', options).subscribe(seriesList => {
    //         if (seriesList.status.succeed === '1') {
    //             //console.log(seriesList);
    //             let seriesLists = seriesList.data.car_product_series_list;
    //             this.rebuildData(seriesLists, 'series');
    //         } else {
    //             this.errorMessage = seriesList.status.error_desc;
    //         }
    //     }, error => this.errorMessage = <any>error);
    // }

    rebuildData(data, keyName) {
        let result = [];
        let label = 'car_product_category_name';
        let value = 'car_product_category_id';
        let dataName = 'carTypeList';
        let labelDefault = '全部';

        let defaultItem: any = {
            label: labelDefault,
            value: '-2',
            car_product_category_name: labelDefault,
            car_product_category_id: '-2'
        };

        if (keyName === 'series') {
            label = 'car_product_series_name';
            value = 'car_product_series_id';
            dataName = 'carSeriesList';
            labelDefault = '全部';

            defaultItem = {
                label: labelDefault,
                value: '-2',
                car_product_series_name: labelDefault,
                car_product_series_id: '-2'
            };

            // this.selectedCarSeries = defaultItem;
        } else {
            // this.selectedCarType = defaultItem;
        }

        result.push(defaultItem);

        data.forEach(newData => {
            newData.label = newData[label];
            newData.value = newData[value];
            result.push(newData);
        });

        if (data.length) {
            this[dataName] = [result];
        } else {
            this[dataName] = [[{
                label: '暂无分类',
                value: '-1',
                disabled: true
            }]];
        }
    }

    refresh() {
        //this.onSelectChanged();
        this.pagination.page = 1;
        this.products = [];
        this.isLoaded = false;
        this.isLoading = true;
        this.goTop();
        setTimeout(() => {
            this.il.restart();
            this.loadProducts();
        }, 300);

    }

    onLoadMore(comp: InfiniteLoaderComponent) {
        console.log("this.isLoading:" + this.isLoading);
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.pagination.page++;
        this.comp = comp;
        this.loadProducts(() => {
            comp.setFinished();
        }, () => {
            comp.resolveLoading();
        });

    }


    onSelectChanged() {
        // let selectedCarSeries = this.selectedCarSeries ;
        // let selectedCarType = this.selectedCarType;
        this.pagination = {
            page: 1,
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

    toCart() {
        if (this.wechatClientConfig.is_tips_join_user_salesman === '1') {
            this.shouldShowWarningBox = false;
            return;
        }
        this.router.navigate(['cart']);
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
            if (content) {
                content.addEventListener('scroll', (event) => {
                    let scrollTop = content.scrollTop;
                    if (scrollTop > height) {
                        this.show = true;
                    } else {
                        this.show = false;
                    }
                    // console.log(content.scrollTop);
                });
            }
        }, 0)
    }
    /**@name 我知道提示了 */
    iSeeTips() {
        this.shouldShowWarningBox = !this.shouldShowWarningBox;
    }

  goToEBoss() {

    if (this.memberDetail.member_auth_info && this.memberDetail.member_auth_info.identity_auth_status === '0') {
      this.router.navigate(['/userInfo']);

      return false;

    }
    // 如果是销售员(不提示成为 Eboss )则跳转到 E04-2，否则跳转到 E11-1
    if (this.wechatClientConfig.is_tips_join_user_salesman === '1' && this.isRole('2')) {
      this.router.navigate(['/userInfo']);

      return false;
    }

    if (this.wechatClientConfig.is_tips_join_user_salesman === '1') {
      this.router.navigate(['/eboss']);

    }

  }
    getMemberDetail() {
        this.baseProvider.post('getMemberDetail', {})
            .subscribe(member => {
                if (member.status.succeed === '1') {
                    this.memberDetail.member_auth_info = member.data.member_auth_info;
                    this.memberDetail.member_role_list = member.data.member_role_list || [];
                    this.getRoleIds();
                } else {
                    this.errorMessage = member.status.error_desc;
                }
            },
                error => this.errorMessage = <any>error
            );
    }
    getRoleIds() {
        let memberRoleList = this.memberDetail.member_role_list;
        this.role_ids = [];
        memberRoleList.forEach(role => {
          this.role_ids.push(role.member_role_id);
        });
      }
    
      isRole(role) {
        console.log(this.role_ids);
        return this.role_ids.indexOf(role) > -1;
      }

}
