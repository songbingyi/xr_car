import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpModule, JsonpModule } from '@angular/http';

import {RouterModule, Routes} from '@angular/router';

import { WeUiModule } from 'ngx-weui';
import {AqmModule} from 'angular-qq-maps';
import {TabsModule} from '../components/tabs/index';

import { IndexComponent } from '../pages/index/index';


import {AppComponent} from './app.component';
import {HomeComponent} from '../pages/home/home';
import {DetailComponent} from '../pages/product/detail/detail';
import {MapComponent} from '../pages/map/map';
import {UserComponent} from '../pages/user/user';

import {AppRoutingModule} from '../routes/routes';
import { UserInfoComponent } from '../pages/user/userInfo/userInfo';
import { CarInfoComponent } from '../pages/user/carInfo/carInfo';
import { ContactComponent } from '../pages/user/contact/contact';
import { AboutComponent } from '../pages/user/about/about';
import { LicenseComponent } from '../pages/license/license';
import { CertificateComponent } from '../pages/certificate/certificate';
import { ReviewComponent } from '../pages/review/review';
import { OrdersComponent } from '../pages/orders/orders';

import { MessageService } from '../providers/messageService';
import { LocalStorage } from '../providers/localStorage';
import { CarListComponent } from '../pages/user/carList/carList';
import { PaymentComponent } from '../pages/pay/payment/payment';
import { RefundComponent } from '../pages/pay/refund/refund';
import { PayCompleteComponent } from '../pages/pay/payComplete/payComplete';
import { ConfirmOrderComponent } from '../pages/orders/confirmOrder/confirmOrder';
import { MailComponent } from '../pages/orders/mail/mail';
import { OrderDetailComponent } from '../pages/orders/orderDetail/orderDetail';


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
        OrdersComponent,
        CarListComponent,
        PaymentComponent,
        RefundComponent,
        PayCompleteComponent,
        ConfirmOrderComponent,
        MailComponent,
        OrderDetailComponent
    ],
    imports      : [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        WeUiModule.forRoot(),
        AqmModule.forRoot({
            apiKey : 'RO6BZ-4HGWX-4CC4F-ZY4JK-KUFPE-DJBPC' // app key为必选项
        }),
        TabsModule
    ],
    providers    : [MessageService, LocalStorage],
    bootstrap    : [AppComponent]
})
export class AppModule {
}
