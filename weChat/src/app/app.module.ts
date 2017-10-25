import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {AqmModule} from 'angular-qq-maps';

import { IndexComponent } from '../pages/index/index';


import {AppComponent} from './app.component';
import {HomeComponent} from '../pages/home/home';
import {DetailComponent} from '../pages/detail/detail';
import {MapComponent} from '../pages/map/map';
import {UserComponent} from '../pages/user/user';

import {AppRoutingModule} from '../route/routes';
import { UserInfoComponent } from '../pages/userInfo/userInfo';
import { CarInfoComponent } from '../pages/carInfo/carInfo';
import { ContactComponent } from '../pages/contact/contact';
import { AboutComponent } from '../pages/about/about';
import { LicenseComponent } from '../pages/license/license';
import { CertificateComponent } from '../pages/certificate/certificate';
import { ReviewComponent } from '../pages/review/review';
import { OrdersComponent } from '../pages/orders/orders';


@NgModule({
    declarations : [
        AppComponent,
        HomeComponent,
        DetailComponent,
        MapComponent,
        UserComponent,
        IndexComponent,
        UserInfoComponent,
        CarInfoComponent,
        ContactComponent,
        AboutComponent,
        LicenseComponent,
        CertificateComponent,
        ReviewComponent,
        OrdersComponent
    ],
    imports      : [
        AppRoutingModule,
        BrowserModule,
        AqmModule.forRoot({
            apiKey : 'RO6BZ-4HGWX-4CC4F-ZY4JK-KUFPE-DJBPC' // app key为必选项
        })
    ],
    providers    : [],
    bootstrap    : [AppComponent]
})
export class AppModule {
}
