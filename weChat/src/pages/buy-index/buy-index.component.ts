import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseProvider } from '../../providers/http/base.http';

@Component({
  selector: 'app-buy-index',
  templateUrl: './buy-index.component.html',
  styleUrls: ['./buy-index.component.scss'],
  encapsulation: ViewEncapsulation.None//允许外部封装
})
export class BuyIndexComponent implements OnInit {
  
  /**@name swiper设置参数 */
  options: object;

  /**@name swiper图片url */
  homeBannerList: object[] = [];

  /**@name 是否出现加入销售员通知*/
  tipsJoinSalesman:string;

  /**@name 隐藏销售员通知控制器*/
  shouldShowWarningBox:Boolean = true;

  /**@name 错误信息 */
  errorMessage: any;

  /**@name 商品分类列表*/ 
  categoryLists: object[]

  constructor(private router: Router, private baseService: BaseProvider) {
    this.getWechatClientConfig()
  }

  ngOnInit() {

    this.options = {
      pagination: {
        el: '.swiper-pagination',
      },
      onInit: () => {
      },
      onSlideChangeEnd: (swiper: any) => {
      }
    };

    this.getHomeBannerList()
    this.loadCategoryList()
   
  }
  /**@name 获取是否弹出成为销售员通知信息 */
  getWechatClientConfig() {
    this.baseService.post('getWechatClientConfig', {}).subscribe(wechatClientConfig => {
      if (wechatClientConfig.status.succeed === '1') {
        this.tipsJoinSalesman = wechatClientConfig.data.wechat_client_config;
        //this.wechatClientConfig.is_tips_join_user_salesman = '1';
        //this.shouldShowWarningBox = wechatClientConfig.data.wechat_client_config.is_tips_join_user_salesman !== '1';
      } else {
        this.errorMessage = wechatClientConfig.status.error_desc;
      }
    }, error => this.errorMessage = <any>error);
  }

  /**@name 是否隐藏成为销售员=>转到cart页面 */
  toCart() {
    // if (this.tipsJoinSalesman === '1') {
    //   this.shouldShowWarningBox = false;
    //   return;
    // }
    this.router.navigate(['cart']);
  }
  /**@name获取首页广告图 */
  getHomeBannerList() {
    this.baseService.post('getHomeBannerList', {}).subscribe(homeBannerList => {
      if (homeBannerList.status.succeed === '1') {
          this.homeBannerList = homeBannerList.data.banner_list;
      } else {
          this.errorMessage = homeBannerList.status.error_desc;
      }
  },
  error => this.errorMessage = <any>error
);
  }

  /**@name 获取车辆商品分类列表 */
  loadCategoryList(){
    this.baseService.post('getCarProductCategoryList', {}).subscribe(categoryList => {
        if (categoryList.status.succeed === '1') {
            //console.log(categoryList);
            this.categoryLists = categoryList.data.car_product_category_list;
            //this.loadSeriesList(categoryLists[0]);
        } else {
            this.errorMessage = categoryList.status.error_desc;
        }
    }, error => this.errorMessage = <any>error);
}
}
