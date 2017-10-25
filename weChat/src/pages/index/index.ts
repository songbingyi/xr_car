import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.html',
  styleUrls: ['./index.scss']
})
export class IndexComponent {

    title = '轩仁车务';
    activeIndex: any = 0;
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

    pages: any = [
        {content : '<app-home></app-home>'},
        {content : 'page2'},
        {content : 'page3'}
    ];

    selected(item, index) {
        this.tabs.forEach(tab => {
            tab.selected = '';
        });
        item.selected = 'weui-bar__item_on';
        this.activeIndex = index;
    }

}
