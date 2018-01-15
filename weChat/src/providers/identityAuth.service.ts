import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { BaseProvider } from './http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {config} from '../app/app.config';


@Injectable()
export class IdentityAuthService {

    memberDetail : any;
    identity_auth_status : boolean;
    errorMessage : any;
    page : string;

    constructor(private http: Http, private baseService: BaseProvider, private route : ActivatedRoute, private router : Router, private location: Location) {

    }

    check(page?) {
        if(config.identityAuth){
            this.page = page || '';
            this.getMemberDetail();
        }
    }

    static identityAuth = config.identityAuth;

    getMemberDetail() {
        this.baseService.post('getMemberDetail', {})
            .subscribe(memberDetail => {
                // console.log(memberDetail);
                if (memberDetail.status.succeed === '1') {
                    this.memberDetail = memberDetail.data;
                    this.identity_auth_status = this.memberDetail.member_auth_info.identity_auth_status === '0';
                    if(this.identity_auth_status) {
                        window.location.href = '/userInfo';
                        //this.router.navigate(['/userInfo']);
                    }
                } else {
                    this.errorMessage = memberDetail.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    redirectTo() {
        if(this.page){
            this.router.navigate(['/'+ this.page]);
        }
    }

    goBack() {
        this.location.back();
    }

    goHome() {
        window.location.href = '/';
    }

}
