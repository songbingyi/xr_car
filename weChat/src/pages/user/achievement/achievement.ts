import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {BaseProvider} from '../../../providers/http/base.http';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogService, DialogConfig } from 'ngx-weui/dialog';

import { ToastComponent, ToastService } from 'ngx-weui/toast';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

import { config } from '../../../app/app.config';
import {PopupComponent} from 'ngx-weui/popup';

@Component({
    selector    : 'app-achievement',
    templateUrl : './achievement.html',
    styleUrls   : ['./achievement.scss']
})
export class AchievementComponent implements OnInit {

    mode : String = 'cert';
    errorMessage: any;
    detail: any;
    isLoaded: Boolean = false;
    dialogConfig: DialogConfig;
    isShowImage:Boolean = false;
    largerImg: String = '';

    @ViewChild('full') fullPopup: PopupComponent;

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        let id: string = this.route.snapshot.paramMap.get('id');
        this.getInitData(id);
    }

    getInitData(id?) {
        this.isLoaded = false;
        this.baseService.post('getServiceOrderDetail', {
            'service_order_id' : id
        })
            .subscribe(detail => {
                if (detail.status.succeed === '1') {
                    this.isLoaded = true;
                    this.detail = detail.data.service_order_info;
                } else {
                    this.errorMessage = detail.status.error_desc;
                    if (detail.status.error_code === '4004') {
                        setTimeout(() => {
                            this.goBack();
                            //this.router.navigate(['/orders', 0]);
                        }, 2000);
                    }
                }
            }, error => this.errorMessage = <any>error);
    }

    goBack() {
        if(!config.identityAuth){
            this.location.back();
        }
    }


}
