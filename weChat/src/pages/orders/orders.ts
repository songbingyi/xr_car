import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    selector    : 'app-orders',
    templateUrl : './orders.html',
    styleUrls   : ['./orders.scss']
})
export class OrdersComponent implements OnInit {
    status : String;
    obj : any = ['全部订单', '待付款', '待处理', '处理中', '已完成'];
    constructor(private route : ActivatedRoute, private router : Router) {
    }

    ngOnInit() {
        this.status = this.obj[this.route.snapshot.paramMap.get('status')];
        console.log(this.status);
    }

}
