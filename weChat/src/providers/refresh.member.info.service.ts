import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import {Headers, Http, RequestOptions, URLSearchParams} from '@angular/http';

import {LocalStorage} from './localStorage';
import { AuthService } from './auth.service';

import {config} from '../app/app.config';

@Injectable()
export class RefreshMemberInfoService {
    member_id: any;
    token: any;
    memberInfo: any;

    constructor(private authService: AuthService, private router: Router, private location: Location, private http : Http) {
        this.member_id = this.authService.getMemberId();
        this.token = this.authService.getToken();
    }

    setSearchParams(path, data) {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('route', path);
        urlSearchParams.append('jsonText', JSON.stringify(data));
        urlSearchParams.append('device_type', '40');
        urlSearchParams.append('device_version', '1.0');
        urlSearchParams.append('version_code', '1');
        urlSearchParams.append('channel', '10001');
        return urlSearchParams;
    }

    getHeader() {
        let headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return new RequestOptions({headers : headers});
    }

    refreshMemberInfo() {
        let urlSearchParams = this.setSearchParams('member/member/loginWithToken', {'member_id':this.member_id,'token':this.token});
        this.http.post(config.api, urlSearchParams, this.getHeader())
            .map(response => {
                return response.json();
            })
            .subscribe(memberInfo => {
            if (memberInfo.status.succeed === '1') {
                this.memberInfo = memberInfo.data;
                this.authService.setMemberId(memberInfo.member_id);
                this.authService.setToken(memberInfo.token);
            } else {
                // this.authService.redirect();
                // this.errorMessage = memberInfo.status.error_desc;
            }
        }, error => {
                // this.authService.redirect();
            // this.errorMessage = <any>error;
        });
    }

}
