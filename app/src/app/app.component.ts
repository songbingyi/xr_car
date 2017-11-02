import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MessageService } from '../providers/messageService';
import { LocalStorage } from '../providers/localStorage';

// import { Subscription } from 'rxjs/Subscription';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.css']
})
export class AppComponent implements OnInit {
    // activeTabIndex: any = 0;

    constructor(private message: MessageService, private localStorage : LocalStorage, private titleService: Title) {
        this.titleService.setTitle('轩仁车务');
    }

    // public subscription: Subscription;


    ngOnInit(): void {
        /*this.subscription = this.message.getMessage().subscribe(msg => {
            this.activeTabIndex = msg.type;
            localStorage.set('activeTabIndex', this.activeTabIndex);
        });*/
    }
}
