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

    errorMessage: any;
    memberScore: any;
    isLoaded: Boolean = false;

    @ViewChild('full') fullPopup: PopupComponent;

    constructor(private route : ActivatedRoute, private router : Router, private baseService: BaseProvider, private toastService: ToastService, private dialogService: DialogService, private location: Location, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        this.getInitData();
    }

    getInitData() {
        this.isLoaded = false;
        this.baseService.post('getSalesMemberDashboard', {

        }).subscribe(memberScore => {
                if (memberScore.status.succeed === '1') {
                    this.isLoaded = true;
                    this.memberScore = memberScore.data;
                } else {
                    this.errorMessage = memberScore.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    goBack() {
        if(!config.identityAuth){
            this.location.back();
        }
    }


}
