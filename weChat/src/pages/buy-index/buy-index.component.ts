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
  images: string[];

  /**@name  是否出现加入销售员通知*/
  tipsJoinSalesman:string;

  /**@name  隐藏销售员通知控制器*/
  shouldShowWarningBox:Boolean = true;

  /**@name 错误信息 */
  errorMessage: any;

  constructor(private router: Router, private baseService: BaseProvider) {
    this.getWechatClientConfig()
  }

  ngOnInit() {

    this.options = {
      pagination: {
        el: '.swiper-pagination',
      },
      onInit: () => {
        console.log('11')
      },
      onSlideChangeEnd: (swiper: any) => {
        console.log('22')
      }
    };
    this.images = ['http://www.songluosuan.com/uploads/allimg/180124/1_1150455801.jpg', 'http://www.songluosuan.com/uploads/allimg/180124/1_1150455801.jpg']

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
}
