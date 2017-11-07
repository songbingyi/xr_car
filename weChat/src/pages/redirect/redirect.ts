import {Component, OnInit} from '@angular/core';

// import {Location} from '@angular/common';

import {config} from '../../app/app.config';

@Component({
    selector    : 'app-redirect',
    templateUrl : './redirect.html',
    styleUrls   : ['./redirect.scss']
})
export class RedirectComponent implements OnInit {
    URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=' + encodeURIComponent(config.url + 'pay/') + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

    constructor() {
        // location.go(this.URL);
        window.location.href = this.URL;
    }

    ngOnInit() {
        // window.location.href = this.URL;
    }

}
