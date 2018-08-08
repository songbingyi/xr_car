import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {MessageService} from '../../providers/messageService';
import {LocalStorage} from '../../providers/localStorage';
import {AuthService} from '../../providers/auth.service';
import {RefreshMemberInfoService} from '../../providers/refresh.member.info.service';
import {IdentityAuthService} from '../../providers/identityAuth.service';
import {Router} from '@angular/router';
import {BaseProvider} from '../../providers/http/base.http';

@Component({
    selector    : 'app-index',
    templateUrl : './index.html',
    styleUrls   : ['./index.scss']
})
export class IndexComponent implements OnInit {

    activeTabIndex : any = 0;
    tabs : any = [
        {
            title      : '首页',
            selected   : 'weui-bar__item_on',
            sizeClass  : 'home',
            icon       : '/assets/images/icon/home.png',
            activeIcon : '/assets/images/icon/home.blue.png'
        },
        {
            title      : '站点',
            selected   : '',
            sizeClass  : 'map',
            icon       : '/assets/images/icon/map.png',
            activeIcon : '/assets/images/icon/map.blue.png'
        },
        {
            title      : '我的',
            selected   : '',
            sizeClass  : 'my',
            icon       : '/assets/images/icon/my.png',
            activeIcon : '/assets/images/icon/my.blue.png'
        }
    ];

    shouldShowWarningNoticeBox = true;
    shouldShowWarningSaleBox = true;
    errorMessage:any;
    wechatClientConfig:any = {};
    memberDetail:any = {};
    role_ids:any = [];

    constructor(private baseService : BaseProvider, private router : Router, private localStorage : LocalStorage, private titleService : Title, private authService: AuthService, private message: MessageService, private refreshMemberInfoService: RefreshMemberInfoService, private identityAuthService:IdentityAuthService) {
        // this.identityAuthService.check();
        this.getMemberDetail();
        this.getWechatClientConfig();
    }

    ngOnInit() : void {
        let activeTabIndex : any = this.localStorage.getS('activeTabIndex');
        this.activeTabIndex = activeTabIndex ? (activeTabIndex - 0) : 0;
        this.setSelected();
        this.isLoggedIn(this.activeTabIndex);
    }

    getWechatClientConfig() {
        this.baseService.post('getWechatClientConfig', {}).subscribe(wechatClientConfig => {
            if (wechatClientConfig.status.succeed === '1') {
                this.wechatClientConfig = wechatClientConfig.data.wechat_client_config;
                //this.wechatClientConfig.is_tips_join_user_salesman = '1';
                this.shouldShowWarningNoticeBox = wechatClientConfig.data.wechat_client_config.is_tips_bind_car_notice !== '1';
                this.shouldShowWarningSaleBox = wechatClientConfig.data.wechat_client_config.is_tips_join_user_salesman !== '1';
            } else {
                this.errorMessage = wechatClientConfig.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
    }

    getMemberDetail() {
        this.baseService.post('getMemberDetail', {})
            .subscribe(member => {
                    if (member.status.succeed === '1') {
                        this.memberDetail.member_auth_info = member.data.member_auth_info;
                        this.memberDetail.member_role_list = member.data.member_role_list || [];
                        this.getRoleIds();
                    } else {
                        this.errorMessage = member.status.error_desc;
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    getRoleIds(){
        let memberRoleList = this.memberDetail.member_role_list;
        this.role_ids = [];
        memberRoleList.forEach(role=> {
            this.role_ids.push(role.member_role_id);
        });
    }

    isRole(role){
        console.log(this.role_ids);
        return this.role_ids.indexOf(role) > -1;
    }

    selected(item, index) {
        if(item.selected){
            this.refresh(item, index);
        }
        this.tabs.forEach(tab => {
            tab.selected = '';
        });
        item.selected = 'weui-bar__item_on';
        // 调用该服务的方法，发送信息；
        // this.message.sendImages('www.baidu.com'); // 发送图片地址
        // this.message.sendMessage(index);
        this.activeTabIndex = index;
        this.isLoggedIn(this.activeTabIndex);
        this.localStorage.setS('activeTabIndex', index);
        // this.titleService.setTitle('轩仁车务-' + item.title);
    }

    refresh(item, index) {
        if (item.selected) {
            if(index === 0){
                this.message.sendMessage('refresh');
            }
            if(index === 1){
                this.message.sendMessage('refreshMap');
            }
            if(index === 2){
                this.message.sendMessage('userRefresh');
            }
        }
    }

    setSelected() {
        let activeTabIndex : any = this.activeTabIndex;
        this.tabs.forEach((tab, index) => {
            tab.selected = '';
            if (activeTabIndex === index) {
                tab.selected = 'weui-bar__item_on';
                // this.titleService.setTitle('轩仁车务-' + tab.title);
            }
        });

    }

    isLoggedIn(index) {
        if (index === 2) {
            if (!this.authService.isLoggedIn()) {
                this.localStorage.remove('activeTabIndex');
                this.authService.redirect();
            }else{
                this.refreshMemberInfoService.refreshMemberInfo();
            }
        }
    }

    iSee(){
        this.shouldShowWarningSaleBox = !this.shouldShowWarningSaleBox;
    }

    goToCarList(){
        this.router.navigate(['/carList']);
    }

    goToEBoss(){
        if(this.memberDetail.member_auth_info && this.memberDetail.member_auth_info.identity_auth_status === '0'){
            this.router.navigate(['/userInfo']);
            return false;
        }
        // 如果是销售员(不提示成为 Eboss )则跳转到 E04-2，否则跳转到 E11-1
        if(this.wechatClientConfig.is_tips_join_user_salesman === '1' && this.isRole('2')){
            this.router.navigate(['/userInfo']);
            return false;
        }

        if(this.wechatClientConfig.is_tips_join_user_salesman === '1'){
            this.router.navigate(['/eboss']);
        }

    }

}
