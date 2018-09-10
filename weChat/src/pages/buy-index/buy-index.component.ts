import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseProvider } from '../../providers/http/base.http';
import { LocalStorage } from '../../providers/localStorage';
import { AuthService } from '../../providers/auth.service';
import { RefreshMemberInfoService } from '../../providers/refresh.member.info.service';
import { ElementRef} from '@angular/core';

@Component({
  selector: 'app-buy-index',
  templateUrl: './buy-index.component.html',
  styleUrls: ['./buy-index.component.scss'],
  // encapsulation: ViewEncapsulation.None//允许外部封装
})
export class BuyIndexComponent implements OnInit {

  /**@name swiper设置参数 */
  options: object;

  /**@name swiper图片url */
  homeBannerList: object[] = [];

  /**@name 单数 */
  odd: boolean = true;

  /**@name 错误信息 */
  errorMessage: any;

  /**@name 商品分类列表*/
  categoryLists: any[];

  /**@name 隐藏成为E老板通知*/
  shouldShowWarningSaleBox = true;
  /**@name 隐藏销售员提示控制器*/
  shouldShowWarningBox: Boolean = true;
  /**@name 用户信息 */
  memberDetail: any = {};
  wechatClientConfig: any;
  role_ids: any = [];

  constructor(private router: Router, private baseService: BaseProvider, private localStorage: LocalStorage, private authService: AuthService, private refreshMemberInfoService: RefreshMemberInfoService, private el: ElementRef ) {
    this.getWechatClientConfig()
    this.getMemberDetail()
  }

  ngOnInit() {
    this.isLoggedIn();
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
  loadCategoryList() {
    this.baseService.post('getCarProductCategoryList', {}).subscribe(categoryList => {
      if (categoryList.status.succeed === '1') {
        //console.log(categoryList);
        this.categoryLists = categoryList.data.car_product_category_list;
        //服务数量是奇数，显示最后一个;
        this.odd = (this.categoryLists.length % 2 !== 0) ? false : true
        //this.loadSeriesList(categoryLists[0]);
      } else {
        this.errorMessage = categoryList.status.error_desc;
      }
    }, error => this.errorMessage = <any>error);
  }

  /**@name 获取是否弹出通知信息 */
  getWechatClientConfig() {
    this.baseService.post('getWechatClientConfig', {}).subscribe(wechatClientConfig => {
      if (wechatClientConfig.status.succeed === '1') {
        this.wechatClientConfig = wechatClientConfig.data.wechat_client_config;
        this.shouldShowWarningSaleBox = wechatClientConfig.data.wechat_client_config.is_tips_join_user_salesman !== '1';
      } else {
        this.errorMessage = wechatClientConfig.status.error_desc;
      }
    }, error => this.errorMessage = <any>error);
  }
  /**@name 我知道通知了 */
  iSeeNotic() {
    this.shouldShowWarningSaleBox = !this.shouldShowWarningSaleBox;
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

  isLoggedIn() {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirect();
    } else {
      this.refreshMemberInfoService.refreshMemberInfo();
    }
  }

  getMemberDetail() {
    this.baseService.post('getMemberDetail', {})
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

  /**@name 是否提示成为销售员=>转到cart页面 */
  toCart() {
    if (this.wechatClientConfig.is_tips_join_user_salesman === '1') {
      this.shouldShowWarningBox = false;
      return;
    }
    this.router.navigate(['cart']);
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
