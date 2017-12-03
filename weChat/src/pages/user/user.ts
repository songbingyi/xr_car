import {Component, OnInit} from '@angular/core';
import {NgZone, OnDestroy} from '@angular/core';

import {BaseProvider} from '../../providers/http/base.http';

@Component({
    selector    : 'app-user',
    templateUrl : './user.html',
    styleUrls   : ['./user.scss']
})
export class UserComponent implements OnInit {

    member: any = {
        'member_info' : {},
        'message_dashboard_info': {
            'new_message_count' : '0'
        },
        'service_order_dashboard_info': {},
    };
    errorMessage: any;

    constructor(private zone : NgZone, private baseProvider : BaseProvider) {
    }

    ngOnInit() {
        this.baseProvider.post('getMemberDashboard', {
            'member_id' : '1'
        })
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        this.member = member.data;
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }
}
