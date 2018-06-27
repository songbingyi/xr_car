import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IdentityAuthService} from '../../providers/identityAuth.service';
import {BaseProvider} from '../../providers/http/base.http';

@Component({
    selector: 'app-notify',
    templateUrl: './notify.html',
    styleUrls: ['./notify.scss']
})
export class NotifyComponent implements OnInit {

    isLoaded: boolean;
    key: string;
    errorMessage: any;
    activeIndex = 0;
    notify_dashboard_info: any;
    subscribe: any;
    memberNotify: any ={};

    personal: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };
    system: any = {
        pagination: {
            page: 1,
            count: 10
        },
        lists: [],
        isLoaded: false
    };

    maps: any = {
        'personal': 'order_total_count',
        'system': 'order_obligation_count'
    };
    paths: any = {
        'personal': 'getMemberMessageList',
        'system': 'getSystemMessageList'
    };
    oPaths: any = {
        'personal': 'operatorMemberMessage',
        'system': 'operatorSystemMessage'
    };
    data: any = {
        'personal': 'member_message_list',
        'system': 'system_message_list'
    };
    objName: any = ['个人消息', '系统消息'];
    objKey: any = ['personal', 'system'];

    constructor(private route: ActivatedRoute, private router: Router, private identityAuthService: IdentityAuthService, private baseService: BaseProvider) {
        this.identityAuthService.check();
        this.getMemberDashboard();
    }

    ngOnInit() {
        this.subscribe = this.route.params.subscribe(params => {
            let activeIndex: string = params.category;
            let page: string = params.page;
            this.activeIndex = parseInt(activeIndex, 10);
            //this.order_type = this.activeIndex;
            this.key = this.objKey[this.activeIndex];
            this[this.key].pagination.page = parseInt(page, 10);

            this.getInitData();

        });
    }

    getMemberDashboard(){
        this.baseService.post('getMemberDashboard', {})
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        this.memberNotify = member.data.message_dashboard_info || {};
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    hasNotify(key, type) {
        return this.notify_dashboard_info && this.notify_dashboard_info[key] !== '0' && this.notify_dashboard_info[key] !== 0;
    }

    onTabSelect(event) {

        //console.log(event);
        //this.order_type = event;
        this.key = this.objKey[event];
        // this[this.key].pagination.page ++;
        //this.getInitData();
        this.activeIndex = event;
        this.router.navigate(['/notify', event, this[this.key].pagination.page], {queryParams: {}});
        // this.getInitData();
    }

    getInitData() {
        this[this.key].isLoaded = false;
        let path = this.paths[this.key];
        this.baseService.mockGet(path, {
            'pagination': this[this.key].pagination,
            'message_status': '9'
        }).subscribe(lists => {
            if (lists.status.succeed === '1') {
                let paginated = lists.paginated;
                this[this.key].isLoaded = true;
                this[this.key].lists = lists.data[this.data[this.key]];
                //this.car_product_order_dashboard_info[this.maps[this.key]] = this[this.key].lists.length;
                this[this.key].pagination.total = Math.ceil((paginated.total - 0) / paginated.count);
            } else {
                this.errorMessage = lists.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    change($event, type) {
        this.key = this.objKey[type];
        this[this.key].pagination.page = $event;
        // this.getInitData();
        this.router.navigate(['/notify', this.activeIndex, $event], {queryParams: {}});
        // this.getInitData();
    }

    isShouldShowMarkedAsRead(category) {
        let lists = this[category].lists || [];
        let result = false;
        lists.forEach(list => {
            if (list.is_read === '0') {
                result = true;
            }
        });
        return result;
    }

    markedAsRead(category) {
        let path = this.oPaths[category];
        let data = {};
        if (category === 'personal') {
            data = {
                member_message_list: this.getOperationList(category)
            };
        } else {
            data = {
                system_message_list: this.getOperationList(category)
            };
        }
        this.baseService.mockGet(path, {
            'ext_data': data,
            'operator_type': '11'
        }).subscribe(lists => {
            if (lists.status.succeed === '1') {
                this[this.key].lists.forEach((item) => {
                    item.is_read = '1';
                });
            } else {
                this.errorMessage = lists.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    getOperationList(category) {
        let results = [];

        this[category].lists.forEach((item) => {
            if (item.is_read === '0') {
                if (category === 'personal') {
                    results.push({
                        'member_message_id': item.member_message_id,
                        'member_message_title': item.member_message_title
                    });
                }else{
                    results.push({
                        'system_message_id': item.system_message_id,
                        'system_message_title': item.system_message_title
                    });
                }
            }
        });
        return results;
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
        //this.roleSubscribe.unsubscribe();
    }

}
