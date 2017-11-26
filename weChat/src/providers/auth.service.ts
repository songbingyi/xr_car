import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

import {LocalStorage} from './localStorage';

import {config} from '../app/app.config';

@Injectable()
export class AuthService {
    member_id: any = '1';
    token: any = 'SASMAL36SKLASKLAMSJKA980D';

    constructor(private localStorage: LocalStorage, private router: Router, private location: Location) {}

    checkLogin(isJustCheck?) {
        let isLoggedIn = this.isLoggedIn();
        if ( !isLoggedIn ) {
            this.redirect();
            return false;
        }
        if (isJustCheck) {
            return true;
        }
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

}
