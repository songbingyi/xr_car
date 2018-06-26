import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../../providers/identityAuth.service';
import {BaseProvider} from '../../../providers/http/base.http';

@Component({
    selector: 'app-notify-detail',
    templateUrl: './detail.html',
    styleUrls: ['./detail.scss']
})
export class NotifyDetailComponent implements OnInit {

    errorMessage: any;
    subscribe: any;
    isLoaded  = false;
    notify:any = {};

    paths:any = {
        'personal': 'getMemberMessageDetail',
        'system'  : 'getSystemMessageDetail'
    };
    data:any = {
        'personal': 'member_message_info',
        'system'  : 'system_message_info'
    };
    constructor(private route: ActivatedRoute, private router: Router, private identityAuthService:IdentityAuthService, private baseService: BaseProvider) {
        this.identityAuthService.check();
    }

    ngOnInit() {
        this.subscribe = this.route.params.subscribe(params => {
            let id: string = params.id;
            let category: string = params.category;
            this.getInitData(id, category);
        });
    }

    getInitData(id, category){
        this.isLoaded = false;
        let path = this.paths[category];
        let data = {};
        if(category === 'system'){
            data = {
                'system_message_id': id
            };
        }else{
            data = {
                'member_message_id': id
            };
        }
        this.baseService.mockGet(path, data).subscribe(notify => {
            if (notify.status.succeed === '1') {
                this.isLoaded = true;
                this.notify = notify.data[this.data[category]];
                //console.log(this.notify);
            } else {
                this.errorMessage = notify.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    redirectTo(){
        if(this.notify.is_link === '1'){
            console.log(this.notify.link_info);
            this.router.navigate(['/notify', ''], {queryParams: {}});
        }
    }

}
