import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { BaseProvider } from '../../providers/http/base.http';

@Component({
    selector    : 'app-orders',
    templateUrl : './orders.html',
    styleUrls   : ['./orders.scss'],
    encapsulation : ViewEncapsulation.None
})
export class OrdersComponent implements OnInit {
    status : string;
    key    : string;
    activeIndex: any;
    isLoaded: boolean;

    all: any = {
        pagination :  {
            page : 1,
            total: 10
        },
        lists : [],
        isLoaded : false
    };
    needPay: any = {
        pagination :  {
            page : 1,
            total: 10
        },
        lists : [],
        isLoaded : false
    };
    needProcess: any = {
        pagination :  {
            page : 1,
            total: 10
        },
        lists : [],
        isLoaded : false
    };
    processing: any = {
        pagination :  {
            page : 1,
            total: 10
        },
        lists : [],
        isLoaded : false
    };
    hasDone: any = {
        pagination :  {
            page : 1,
            total: 10
        },
        lists : [],
        isLoaded : false
    };

    errorMessage: any;

    objName : any = ['全部订单', '待付款', '待处理', '处理中', '已完成'];
    objKey : any = ['all', 'needPay', 'needProcess', 'processing', 'hasDone'];
    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider) {
    }

    ngOnInit() {
        let activeIndex: string = this.route.snapshot.paramMap.get('status');
        this.activeIndex = parseInt(activeIndex, 10);
        // this.status = this.objName[this.activeIndex];
        this.key    = this.objKey[this.activeIndex];
        this.getInitData();
    }

    onTabSelect(event) {
        // console.log(event);
    }

    getInitData() {
        this[this.key].isLoaded = false;
        this.baseService.post('getServiceOrderList', {
            'pagination' : this[this.key].pagination,
            'type'       : this.key
        })
            .subscribe(lists => {
                if (lists.status.succeed) {
                    this[this.key].isLoaded = true;
                    this[this.key].lists = lists.data.service_order_list;
                } else {
                    this.errorMessage = lists.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    change($event, type) {
        this.key    = this.objKey[type];
        this[this.key].pagination.page ++;
        this.getInitData();
    }

}
