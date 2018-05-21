import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../providers/identityAuth.service';
import {LocalStorage} from '../../providers/localStorage';

@Component({
    selector    : 'app-success',
    templateUrl : './success.html',
    styleUrls   : ['./success.scss']
})
export class SuccessComponent implements OnInit {
    isSuccess : Boolean = false;
    errorMessage : any;
    order: any;
    isLoaded: Boolean = false;
    orderId: Number;

    constructor(private localStorage: LocalStorage, private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        //let member_role_list = this.localStorage.getObject('member_role_list');
    }

}
