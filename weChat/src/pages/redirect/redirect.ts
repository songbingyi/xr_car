import {Component, OnInit} from '@angular/core';

// import {Location} from '@angular/common';

import {config} from '../../app/app.config';
import {IdentityAuthService} from '../../providers/identityAuth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseProvider} from '../../providers/http/base.http';

@Component({
    selector    : 'app-redirect',
    templateUrl : './redirect.html',
    styleUrls   : ['./redirect.scss']
})
export class RedirectComponent implements OnInit {
    URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=' + encodeURIComponent(config.url + 'login/') + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

    subscribe:any;

    constructor(private route: ActivatedRoute, private router: Router, private identityAuthService: IdentityAuthService, private baseService: BaseProvider) {
        // location.go(this.URL);
        //window.location.href = this.URL;
    }

    ngOnInit() {
        this.subscribe = this.route.params.subscribe(params => {
            console.log(params);
        });
    }

}
