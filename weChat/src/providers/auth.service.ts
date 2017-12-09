import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import {Headers, Http, RequestOptions, URLSearchParams} from '@angular/http';

import {LocalStorage} from './localStorage';
import {BaseProvider} from './http/base.http';

import {config} from '../app/app.config';

@Injectable()
export class AuthService {
    member_id: any; // = '1';
    token: any; // = '14cfdaad35c1005073b9b0b2c425beb3';

    constructor(private localStorage: LocalStorage, private router: Router, private location: Location, private http : Http) {
        this.parseSession();
        // this.updateMemberInfo();
    }

    parseSession() {
        let session = this.getSession();
        if (session) {
            let member_id = session.split('__')[1];
            let token     = session.split('__')[0];
            if (!this.member_id && member_id) {
                this.member_id = member_id;
            }
            if (!this.token && token) {
                this.token = token;
            }
        }
    }

    checkLogin(isJustCheck?) {
        let isLoggedIn = this.isLoggedIn();
        if ( !isLoggedIn ) {
            this.redirect();
            return false;
        }
        if (isJustCheck) {
            return true;
        }

        this.parseSession();

        return true;
    }

    isLoggedIn() {
        return !!this.getSession();
    }

    redirect() {
        let path = window.location.href;
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=' + encodeURIComponent(config.url + 'login/') + '&response_type=code&scope=snsapi_userinfo&state=' + encodeURIComponent(path) + '#wechat_redirect';
    }

    setMemberId(id) {
        this.member_id = id;
    }

    getMemberId() {
        return this.member_id;
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    getSession() {
        return this.localStorage.get('sessionId');
    }

    setSession(sessionId) {
        if (sessionId) {
            this.localStorage.set('sessionId', sessionId);
        }
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

    updateMemberInfo() {
        let urlSearchParams = this.setSearchParams('base/tools/updateMemberInfo', {'member_id':this.member_id});
        this.http.post(config.api, urlSearchParams, this.getHeader())
            .map(response => {
                return response.json();
            })
            .subscribe(memberInfo => {
            if (memberInfo.status.succeed === '1') {
                // this.memberInfo = memberInfo.data;
            } else {
                // this.errorMessage = memberInfo.status.error_desc;
            }
        }, error => {
            // this.errorMessage = <any>error;
        });
    }

}
