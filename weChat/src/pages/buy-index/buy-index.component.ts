import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router) { }

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
    this.images = ['http://www.songluosuan.com/uploads/allimg/180124/1_1150455801.jpg','http://www.songluosuan.com/uploads/allimg/180124/1_1150455801.jpg']
  }
    /**@name 验证产品是否可以购买=>是否提示成为销售员=>转到cart页面 */
    toCart() {
      // if(this.product.is_can_order === '0'){
      //     return;
      // }
      // if(this.wechatClientConfig.is_tips_join_user_salesman === '1'){
      //     this.shouldShowWarningBox = false;
      //     return;
      // }
      this.router.navigate(['cart', 0], { queryParams: { product_id: 0 } });
  }
}
