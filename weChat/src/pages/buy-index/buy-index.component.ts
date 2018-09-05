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
      },
      onInit: () => {
        console.log('11')
      },
      onSlideChangeEnd: (swiper: any) => {
        console.log('22')
      }
    };
    this.images = ['http://www.songluosuan.com/uploads/allimg/180124/1_1150455801.jpg']
  }

}
