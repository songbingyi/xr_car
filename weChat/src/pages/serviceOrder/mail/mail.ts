import {Component, OnInit} from '@angular/core';

@Component({
    selector    : 'app-mail',
    templateUrl : './mail.html',
    styleUrls   : ['./mail.scss']
})
export class MailComponent implements OnInit {

    res = {
        txt : ''
    };

    errorMessage: any;

    constructor() {

    }

    ngOnInit() {
    }

}
