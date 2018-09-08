

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { WXService } from '../../providers/wx.service';

import { BaseProvider } from '../../providers/http/base.http';
import { LocalStorage } from '../../providers/localStorage';

import { ProductsModel } from '../../models/product.model';
import { ProductModel } from '../../models/product.model';

import { InfiniteLoaderComponent } from 'ngx-weui/infiniteloader';

import { Observable } from 'rxjs/Rx';
import { MessageService } from '../../providers/messageService';
import { PickerService } from 'ngx-weui/picker';
import { IdentityAuthService } from '../../providers/identityAuth.service';

@Component({
  selector: 'app-handy-traffi',
  templateUrl: './handy-traffi.component.html',
  styleUrls: ['./handy-traffi.component.scss']
})
export class HandyTraffiComponent implements OnInit {


  errorMessage: any;


  /**@name 服务列表 */
  serviceTypes: any = [];
  /**@name 单数 */
  odd:boolean  = true;

  @ViewChild(InfiniteLoaderComponent) il;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;


  constructor(private baseProvider: BaseProvider, private router: Router, private localStorage: LocalStorage, private message: MessageService,private identityAuthService: IdentityAuthService) {
    this.message.getMessage().subscribe(msg => {
      if (msg.type === 'refresh') {
        this.refresh();
      }
    });
    this.identityAuthService.check();

  }



  ngOnInit() {
    this.getServiceTypeList()
  }

  ngAfterViewInit() {
    // this.bindEvent();
  }
  /**@name 获取服务列表 */
  getServiceTypeList() {
    this.baseProvider.post('getServiceTypeList', {})
      .subscribe(serviceTypes => {
        if (serviceTypes.status.succeed === '1') {
          this.serviceTypes = serviceTypes.data.service_type_list;
          //服务数量是奇数，显示最后一个;
          this.odd = (this.serviceTypes.length%2 !== 0)? false : true
          console.log(this.odd)
        } else {
          this.errorMessage = serviceTypes.status.error_desc;
        }
      }, error => this.errorMessage = <any>error);
  }





  refresh() {
    //this.onSelectChanged();
    setTimeout(() => {
      this.il.restart();

    }, 300);

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
  /**@name 点击服务 */
  goModule(serviceType) {
    if (serviceType.service_type_status === '1') {
      this.localStorage.setObject(serviceType.service_type_key, serviceType);
      this.router.navigate([serviceType.service_type_key]);
    }
  }



  // bindEvent() {
  //   let $body = document.querySelector('body');
  //   let height = $body.clientHeight || $body.offsetHeight;
  //   setTimeout(() => {
  //     let content = document.querySelector('.weui-infiniteloader__content');
  //     // console.log(content);
  //     if (content) {
  //       content.addEventListener('scroll', (event) => {
  //         let scrollTop = content.scrollTop;
  //         if (scrollTop > height) {
  //           this.show = true;
  //         } else {
  //           this.show = false;
  //         }
  //         // console.log(content.scrollTop);
  //       });
  //     }
  //   }, 0)
  // }

}

