import {Component, OnInit} from '@angular/core';
import {BaseProvider} from '../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../providers/identityAuth.service';
import {LocalStorage} from '../../providers/localStorage';
import {WXSDKService} from '../../providers/wx.sdk.service';

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

    wxs:any;

    constructor(private localStorage: LocalStorage, private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider, private identityAuthService:IdentityAuthService, private wxService: WXSDKService) {
        this.identityAuthService.check();
        this.wxs = this.wxService.init();
    }

    ngOnInit() {
    }

    cancel(e) {
        e.stopPropagation();
        this.wxs.then((wx)=>{
            wx.closeWindow();
        });
        return false;
    }

}
