import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityAuthService } from '../../../providers/identityAuth.service';
import { BaseProvider } from '../../../providers/http/base.http';

@Component({
    selector: 'app-notify-detail',
    templateUrl: './detail.html',
    styleUrls: ['./detail.scss']
})
export class NotifyDetailComponent implements OnInit {

    errorMessage: any;
    subscribe: any;
    isLoaded = false;
    notify: any = {};



    /**@name 请求文章详情的接口地址 */
    paths: any = [
        'getMemberMessageDetail',
        'getSystemMessageDetail'
    ];
    /**@name 接口返回的名字 */
    data: any = 
        [
            'member_message_info',
        'system_message_info'
    ]


    constructor(private route: ActivatedRoute, private router: Router, private identityAuthService: IdentityAuthService, private baseService: BaseProvider) {
        // this.identityAuthService.check();
    }

    ngOnInit() {
        this.subscribe = this.route.params.subscribe(params => {
            let category: string = params.category;//文章分类ID 0 个人 1 系统
            let id: string = params.id;//文章ID
            this.getInitData(category, id);
        });
    }

    getInitData(category, id) {
        this.isLoaded = false;
        console.log('分类',category)
        let data = {};
        if (category == '1') {
            data = {
                'system_message_id': id
            };
        }
        if(category == '0') {
            data = {
                'member_message_id': id
            };
        }
        this.baseService.post(this.paths[category], data).subscribe(notify => {
            if (notify.status.succeed === '1') {
                this.isLoaded = true;
                this.notify = notify.data[this.data[category]];
                // this.redirectTo();
                //console.log(this.notify);
            } else {
                this.errorMessage = notify.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    // redirectTo() {
    //     if (this.notify.is_link === '1') {
    //         console.log(this.notify.link_info);
    //         this.router.navigate(['/redirect'], { queryParams: this.notify.link_info });
    //     }
    // }

}
