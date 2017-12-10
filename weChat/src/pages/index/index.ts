import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {MessageService} from '../../providers/messageService';
import {LocalStorage} from '../../providers/localStorage';
import {AuthService} from '../../providers/auth.service';

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

    constructor(private localStorage : LocalStorage, private titleService : Title, private authService: AuthService, private message: MessageService) {

    }

    ngOnInit() : void {
        let activeTabIndex : any = this.localStorage.getS('activeTabIndex');
        this.activeTabIndex = activeTabIndex ? (activeTabIndex - 0) : 0;
        this.setSelected();
        this.isLoggedIn(this.activeTabIndex);
    }

    selected(item, index) {
        this.refresh(item, index);
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
            }
        }
    }

}
