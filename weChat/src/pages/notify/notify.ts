import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityAuthService } from '../../providers/identityAuth.service';
import { BaseProvider } from '../../providers/http/base.http';

import { InfiniteLoaderComponent, InfiniteLoaderConfig } from 'ngx-weui/infiniteloader';
// import { PTRComponent } from 'ngx-weui';

@Component({
    selector: 'app-notify',
    templateUrl: './notify.html',
    styleUrls: ['./notify.scss']
})
export class NotifyComponent implements OnInit {
    @ViewChild(InfiniteLoaderComponent) il;
    comp: InfiniteLoaderComponent;


    errorMessage: any;

    notify_dashboard_info: any;
    subscribe: any;
    memberNotify: any = {};

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

    /**@name 读取是否完成 */
    isLoaded: boolean;
    /**@name 是否读取中 */
    isLoading: boolean = false
    /**@name当前tab的列表内容 */
    key: string;
    /**@name 被选中的tab编号 */
    currentTabId: string = '0';
    /**@name 分页和每页数量 */
    pagination = {
        page: 1,
        count: 10
    };
    /**@name 进入页面默认的tabid */
    defaultTabId: Number = 0;
    /**@name 数据载入完成 */
    isloaded: boolean = false
    /**@name 消息内容列表 */
    messageList: any[] = [];
    /**@name 请求listAPI的路径 */
    paths: any = [
        'getMemberMessageList',
        'getSystemMessageList'
    ];
    /**@name 接口返回list的数组名称 */
    listDataName: any = [
        'member_message_list',
        'system_message_list'
    ];
    /**@name badge数字 */
    dashboardInfo:any= {}
    /**@name 滚动加载更多的配置项 */
    config: any = <any>{
        percent: 90,
        height: '85vh'
    }
    /**@name 编辑按钮是否隐藏 */
    hiddenEdit: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private identityAuthService: IdentityAuthService, private baseService: BaseProvider) {
        // this.identityAuthService.check();
        // this.getMemberDashboard();
    }
    // 下拉刷新功能
    // onRefresh(ptr: PTRComponent) {
    //     setTimeout(() => {
    //         console.log('刷新')
    //         this.refresh()
   
    //         this.getInitData(this.currentTabId);
    //         this.getMessageDashboard()
    //         // this.il.restart()
    //         ptr.setFinished();
    //     }, 500);

    //   }

    ngOnInit() {
        this.subscribe = this.route.params.subscribe(params => {
            this.defaultTabId = params.category;//由路由确定默认进来是个人还是系统
            console.log('this.activeTabId', this.defaultTabId)
            // this.activeIndex = parseInt(activeIndex, 10);
            //this.order_type = this.activeIndex;
            // this.key = this.objKey[this.activeIndex];
            // this[this.key].pagination.page = parseInt(page, 10);
            // this.getInitData(1);
            this.getInitData(this.defaultTabId);
        });
        this.getMessageDashboard()
        
    }

    /**@name 选择个人消息或者系统消息 */
    selectedTab(item) {
        this.currentTabId = item;

        console.log('被选中的tab编号:', this.currentTabId)
        this.refresh()
        // this.il.restart()
        this.getInitData(this.currentTabId);
        this.getMessageDashboard()
        // alert(item)
    }
    /**@name 页数归零，消息列表刷新，*/
    refresh() {
        this.pagination = {
            page: 1,
            count: 10
        };
        this.messageList= [];
        this.isLoaded = true;
        this.isLoading = false;
        console.log('this.il.restart',this.il.restart)
        setTimeout(() => {
            this.il.restart();
        }, 200);
        console.log('refresh')
    }

    /**@name 获取badge数字 */
    getMessageDashboard() {
        this.baseService.post('getMemberMessageDashboard', {}).subscribe(d => {
            if (d.status.succeed == '1') {
                // this.dashboardInfo = d.data.message_dashboard_info
                this.dashboardInfo = d.data.message_dashboard_info || {};
                  console.log('getMemberMessageDashboard',this.dashboardInfo)
            } else {
                this.errorMessage = d.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    /**@name 首次进入页面获取消息list
     * @name 获取个人还是系统 0：个人；1：系统
     */
    getInitData(id,callbackDone?, callbackOnce?) {
        this.isloaded = false
        let info = {
            pagination:this.pagination,
            message_status:'9'
        }
        console.log('请求参数',info)
        this.baseService.post(this.paths[id], info
        ).subscribe(lists => {

            if (lists.status.succeed === '1') {
                this.messageList = this.messageList.concat(lists.data[this.listDataName[id]])
                console.log('this.messageList', this.messageList)
                console.log('lists.paginated.more',lists.paginated.more)
                if(this.messageList.length == 0){
                    this.hiddenEdit = true;
                }
                if ((lists.paginated.more === '0') && !!callbackDone) {
                    return callbackDone();
                }

                if (callbackOnce) {
                    callbackOnce();
                }
                this.isloaded = true;
                this.isLoading = false;

            } else {
                this.errorMessage = lists.status.error_desc;
            }
    

        }, error => this.errorMessage = <any>error);
    }

    // onSelectChanged() {
    //     // let selectedCarSeries = this.selectedCarSeries ;
    //     // let selectedCarType = this.selectedCarType;
    //     this.pagination = {
    //         page: 1,
    //         count: 10
    //     };
    //     this. = [];
    //     // this.isLoaded = false;
    //     // this.isLoading = true;
    //     this.il.restart();
    //     // this.loadProducts();
    //     console.log('onSelectChanged')
    // }

    // getMemberDashboard() {
    //     this.baseService.post('getMemberMessageDashboard', {})
    //         .subscribe(member => {
    //             if (member.status.succeed === '1') {
    //                 this.memberNotify = member.data.message_dashboard_info || {};
    //                 console.log('getMemberMessageDashboard',this.memberNotify)
    //             } else {
    //                 this.errorMessage = member.status.error_desc;
    //             }
    //         },
    //             error => this.errorMessage = <any>error
    //         );
    // }

    hasNotify(key, type) {
        return this.notify_dashboard_info && this.notify_dashboard_info[key] !== '0' && this.notify_dashboard_info[key] !== 0;
    }

    // onTabSelect(event) {

    //     //console.log(event);
    //     //this.order_type = event;
    //     this.key = this.objKey[event];
    //     // this[this.key].pagination.page ++;
    //     //this.getInitData();
    //     this.activeIndex = event;
    //     this.router.navigate(['/notify', event, this[this.key].pagination.page], { queryParams: {} });
    //     // this.getInitData();
    // }
    /**@name 获取消息列表 */


    // change($event, type) {
    //     this.key = this.objKey[type];
    //     this[this.key].pagination.page = $event;
    //     // this.getInitData();
    //     this.router.navigate(['/notify', this.activeIndex, $event], { queryParams: {} });
    //     // this.getInitData();
    // }

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
            //'ext_data': data,
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
                } else {
                    results.push({
                        'system_message_id': item.system_message_id,
                        'system_message_title': item.system_message_title
                    });
                }
            }
        });
        return results;
    }

    /*redirectTo(notify, id, type){
        if(notify.is_link === '1'){
            console.log(notify.link_info);
            this.router.navigate(['/redirect', ''], {queryParams: notify.link_info});
        }else{
            this.router.navigate(['/notifyDetail', id, type]);
        }
    }*/

    ngOnDestroy() {
        this.subscribe.unsubscribe();
        //this.roleSubscribe.unsubscribe();
    }
    /**@name 加载更多 */
    onLoadMore(comp: InfiniteLoaderComponent) {
        console.log('this.isLoading',this.isLoading)
        // console.log("this.isLoading:" + this.isLoading);
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.pagination.page++;
        this.comp = comp;
        //参数1：当前tabid
        this.getInitData(this.currentTabId,() => {
            comp.setFinished();
        }, () => {
            comp.resolveLoading();
        });
    }

    bindEvent() {
        let $body = document.querySelector('body');
        let height = $body.clientHeight || $body.offsetHeight;
        setTimeout(() => {
            let content = document.querySelector('.weui-infiniteloader__content');
            console.log(content);
            if (content) {
                content.addEventListener('scroll', (event) => {
                    let scrollTop = content.scrollTop;
                    if (scrollTop > height) {
                        // this.show = true;
                    } else {
                        // this.show = false;
                    }
                    // console.log(content.scrollTop);
                });
            }
        }, 0)
    }

}
