import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    selector    : 'app-orders',
    templateUrl : './orders.html',
    styleUrls   : ['./orders.scss'],
    encapsulation : ViewEncapsulation.None
})
export class OrdersComponent implements OnInit {
    status : string;
    activeIndex: any;
    isLoaded: boolean;
    hasDone: any;
    needProcess: any;
    processing: any;
    needPay: any;


    obj : any = ['全部订单', '待付款', '待处理', '处理中', '已完成'];
    constructor(private route : ActivatedRoute, private router : Router) {
    }

    ngOnInit() {
        let activeIndex: string = this.route.snapshot.paramMap.get('status');
        this.activeIndex = parseInt(activeIndex, 10);
        this.status = this.obj[this.activeIndex];
    }

    onTabSelect() {

    }

}
