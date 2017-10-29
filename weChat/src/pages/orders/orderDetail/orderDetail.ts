import {Component, OnInit} from '@angular/core';

@Component({
    selector    : 'app-order-detail',
    templateUrl : './orderDetail.html',
    styleUrls   : ['./orderDetail.scss']
})
export class OrderDetailComponent implements OnInit {

    mode : String = 'license';

    constructor() {
    }

    ngOnInit() {
    }

    changeMode(type) {
        this.mode = type;
    }

}
