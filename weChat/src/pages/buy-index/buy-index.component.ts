import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-index',
  templateUrl: './buy-index.component.html',
  styleUrls: ['./buy-index.component.scss']
})
export class BuyIndexComponent implements OnInit {
  /**@name swiper设置参数 */
  options: object;
  /**@name swiper图片url */
  images: string[];
  constructor() { }

  ngOnInit() {

    this.options = {
      pagination: {
        el: '.swiper-pagination',
        bulletClass : 'my-bullet',
      },
      onInit: () => {

      },
      onSlideChangeEnd: (swiper: any) => {
      }
    };
    this.images = ['http://www.songluosuan.com/uploads/allimg/180124/1_1150455801.jpg','https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3246517076,2158128194&fm=58&s=06C3D9169CF012902B94BDCE030070A1&bpow=121&bpoh=75']
  }

}
