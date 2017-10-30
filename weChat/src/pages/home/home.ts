import { Component, OnInit } from '@angular/core';

import { WXService } from '../../providers/wx.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  constructor(private wxService: WXService) { }

    status: string;
    ngOnInit() {
        this.wxService.config({
            title: '新标题'
        }).then(() => {
            // 其它操作，可以确保注册成功以后才有效
            this.status = '注册成功';
        }).catch((err: string) => {
            this.status = `注册失败，原因：${err}`;
        });
    }

}
