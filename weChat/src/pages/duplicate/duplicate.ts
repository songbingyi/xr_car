import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../providers/identityAuth.service';
import {LocalStorage} from '../../providers/localStorage';

@Component({
    selector    : 'app-duplicate',
    templateUrl : './duplicate.html',
    styleUrls   : ['./duplicate.scss']
})
export class DuplicateComponent implements OnInit {
    isSuccess : Boolean = false;
    errorMessage : any;
    order: any;
    isLoaded: Boolean = false;
    orderId: Number;

    constructor(private localStorage: LocalStorage, private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
    }

}
