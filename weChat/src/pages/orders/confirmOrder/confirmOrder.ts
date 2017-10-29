import {Component, OnInit} from '@angular/core';

@Component({
    selector    : 'app-confirm-order',
    templateUrl : './confirmOrder.html',
    styleUrls   : ['./confirmOrder.scss']
})
export class ConfirmOrderComponent implements OnInit {

    mode : String = 'license';

    constructor() {
    }

    ngOnInit() {
    }


    changeMode(type) {
        this.mode = type;
    }

}
