import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MessageService } from '../../providers/messageService';
import { LocalStorage } from '../../providers/localStorage';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.scss']
})
export class IndexComponent implements OnInit {

    activeTabIndex: any = 0;
    tabs: any = [
        {
            title    : '首页',
            selected : 'weui-bar__item_on',
            icon     : 'assets/tmp/icon_tabbar.png'
        },
        {
            title    : '站点',
            selected : '',
            icon     : 'assets/tmp/icon_tabbar.png'
        },
        {
            title    : '我的',
            selected : '',
            icon     : 'assets/tmp/icon_tabbar.png'
        }
    ];

    constructor(private message: MessageService, private localStorage : LocalStorage, private titleService: Title ) {

    }

    ngOnInit(): void {
        let activeTabIndex: any = this.localStorage.get('activeTabIndex');
        this.activeTabIndex = activeTabIndex ? (activeTabIndex - 0) : 0;
        this.setSelected();

    }

    selected(item, index) {
        this.tabs.forEach(tab => {
            tab.selected = '';
        });
        item.selected = 'weui-bar__item_on';
        // 调用该服务的方法，发送信息；
        // this.message.sendImages('www.baidu.com'); // 发送图片地址
        // this.message.sendMessage(index);
        this.activeTabIndex = index;
        this.localStorage.set('activeTabIndex', index);
        this.titleService.setTitle('轩仁车务-' + item.title);
    }

    setSelected() {
        let activeTabIndex: any = this.activeTabIndex;
        this.tabs.forEach((tab, index) => {
            tab.selected = '';
            if (activeTabIndex === index ) {
                tab.selected = 'weui-bar__item_on';
                this.titleService.setTitle('轩仁车务-' + tab.title);
            }
        });

    }

}
