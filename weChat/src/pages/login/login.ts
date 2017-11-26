import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap, Route} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { BaseProvider } from '../../providers/http/base.http';
import { AuthService } from '../../providers/auth.service';
import { LocalStorage } from '../../providers/localStorage';

@Component({
    selector    : 'app-login',
    templateUrl : './login.html',
    styleUrls   : ['./login.scss']
})
export class LoginComponent implements OnInit {

    code : any;
    state: any;
    member: any;
    errorMessage : any;
    isLoggedFailed: Boolean = false;

    constructor(private route : ActivatedRoute, private router : Router, private baseService : BaseProvider, private authService: AuthService, private localStorage: LocalStorage) {
    }

    ngOnInit() {
        let queryParams = this.route.snapshot.queryParams;
        this.code = queryParams.code;
        this.state = queryParams.state;
        this.getMemberInfo();
    }

    getMemberInfo() {
        this.baseService.post('loginWithWechat', {
            'wechat_code' : this.code
        }, true)
            .subscribe(member => {
                if (member.status.succeed === '1') {
                    this.member = member.data;
                    // console.log('this.member');
                    // console.log(this.member);
                    if (this.member.token && this.member.member_id) {
                        this.authService.setSession(this.member.token + '__' + this.member.member_id);
                        this.authService.setMemberId(this.member.member_id);
                        this.authService.setToken(this.member.token);
                        window.location.href = this.state;
                    } else {
                        this.isLoggedFailed = true;
                    }
                } else {
                    this.isLoggedFailed = true;
                    this.errorMessage = member.status.error_desc;
                }
            }, error => {
                this.isLoggedFailed = true;
                this.errorMessage = <any>error;
            });
    }

    goHome() {
        this.localStorage.set('activeTabIndex', '0');
        this.router.navigate(['']);
    }
}
