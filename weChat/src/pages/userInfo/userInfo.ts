import {Component, OnInit} from '@angular/core';

@Component({
    selector    : 'app-user-info',
    templateUrl : './userInfo.html',
    styleUrls   : ['./userInfo.scss']
})
export class UserInfoComponent implements OnInit {
    hasPhone : Boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

}
