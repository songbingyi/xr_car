import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

import {LocalStorage} from './localStorage';

import {config} from '../app/app.config';

@Injectable()
export class AuthService {
    member_id: any = '1';
    accessToken: any = 'SASMAL36SKLASKLAMSJKA980D';

    constructor(private localStorage: LocalStorage, private router: Router) {}

    checkLogin() {
        let isLoggedIn = !!this.getSession();
        if ( !isLoggedIn ) {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=' + encodeURIComponent(config.url + 'login/') + '&response_type=code&scope=snsapi_userinfo&state=' + config.salt_key + '#wechat_redirect';
            return false;
        }

        return true;
    }

    setMemberId(id) {
        this.member_id = id;
    }

    getMemberId() {
        return this.member_id;
    }

    setAccessToken(token) {
        this.accessToken = token;
    }

    getAccessToken() {
        return this.accessToken;
    }

    getSession() {
        return true; // this.localStorage.get('sessionId');
    }

    setSession(sessionId) {
        this.localStorage.set('sessionId', sessionId);
    }

}
