import {Component} from '@angular/core';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.css']
})
export class AppComponent {
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

    pages: any = ['page1', 'page2', 'page3'];

    selected(item, index) {
        this.tabs.forEach(tab => {
            tab.selected = '';
        });
        item.selected = 'weui-bar__item_on';
        this.activeIndex = index;
    }
}
