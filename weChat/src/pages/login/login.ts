import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap, Route} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../providers/http/base.http';
import { AuthService } from '../../providers/auth.service';

@Component({
    selector    : 'app-login',
    templateUrl : './login.html',
    styleUrls   : ['./login.scss']
})
export class LoginComponent implements OnInit {

    code : any;
    member: any;
    errorMessage : any;

    constructor(private route : ActivatedRoute, private router : Router, private baseService : BaseProvider, private authService: AuthService) {
    }

    ngOnInit() {
        this.code = this.route.snapshot.paramMap.get('code');
        this.getMemberInfo();
        console.log(this.code);
    }

    getMemberInfo() {
        this.baseService.post('loginWithWechat', {
            'wechat_code' : this.code
        })
            .subscribe(member => {
                if (member.status.succeed) {
                    this.member = member.data;
                    this.authService.setSession(this.member.sessionId);
                    this.authService.setMemberId(this.member.member_id);
                    this.authService.setAccessToken(this.member.accessToken);
                    this.router.navigate(['']);
                } else {
                    this.errorMessage = member.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

}
