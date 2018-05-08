import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { HttpModule, JsonpModule } from '@angular/http';

import {RouterModule, Routes} from '@angular/router';

import { WeUiModule } from 'ngx-weui';
// import { AqmModule } from 'angular-qq-maps';
import { NgxAmapModule } from 'ngx-amap';
import { TabsModule } from '../components/tabs';

import { IndexComponent } from '../pages/index';

import { AppComponent } from './app.component';
import { HomeComponent } from '../pages/home/home';
import { DetailComponent } from '../pages/product/detail/detail';
import { MapComponent } from '../pages/map/map';
import { UserComponent } from '../pages/user/user';

import { AppRoutingModule } from '../routes/routes';
import { UserInfoComponent } from '../pages/user/userInfo/userInfo';
import { UserSellerComponent } from '../pages/user/userSeller/userSeller';
import { CarInfoComponent } from '../pages/user/carInfo/carInfo';
import { ContactComponent } from '../pages/user/contact/contact';
import { AboutComponent } from '../pages/user/about/about';
import { LicenseComponent } from '../pages/license/license';
import { CertificateComponent } from '../pages/certificate/certificate';
import { ReviewComponent } from '../pages/review/review';
import { OrdersComponent } from '../pages/orders/orders';

import { NotifyComponent } from '../pages/notify/notify';
import { CategoryComponent } from '../pages/notify/category/category';
import { NotifyDetailComponent } from '../pages/notify/detail/detail';

import { CarListComponent } from '../pages/user/carList/carList';
import { PaymentComponent } from '../pages/pay/payment/payment';
import { RefundComponent } from '../pages/pay/refund/refund';
import { PayCompleteComponent } from '../pages/pay/payComplete/payComplete';
import { ConfirmOrderComponent } from '../pages/orders/confirmOrder/confirmOrder';
import { MailComponent } from '../pages/orders/mail/mail';
import { OrderDetailComponent } from '../pages/orders/orderDetail/orderDetail';


import { KeysPipe } from '../pipes/keys';
import { DistancePipe } from '../pipes/distance';
import { PlateFormatPipe } from '../pipes/plate.format';
import { StarHiddenPipe } from '../pipes/star.hidden';

import { FocusBlurDirective } from '../directives/focus.blur';

import { MessageService } from '../providers/messageService';
import { LocalStorage } from '../providers/localStorage';
import { CustomValidators } from '../providers/custom.validators';
// import { WXService } from '../providers/wx.service';
import { WXSDKService } from '../providers/wx.sdk.service';
import { AuthService } from '../providers/auth.service';
import { AuthGuard } from '../providers/auth-guard.service';
import { ImageTypeList } from '../providers/imageType.service';
import { PaymentTypeList } from '../providers/paymentType.service';
import { IdentityAuthService } from '../providers/identityAuth.service';

import { BaseProvider } from '../providers/http/base.http';
import { RedirectComponent } from '../pages/redirect/redirect';
import { LoginComponent } from '../pages/login/login';
import { EditOrderComponent } from '../pages/orders/editOrder/editOrder';

import {config} from './app.config';
import {RefreshMemberInfoService} from '../providers/refresh.member.info.service';
import { RescueComponent } from '../pages/rescue/rescue.component';
import { RescueDetailComponent } from '../pages/rescueDetail/rescue-detail.component';
import { RescueRankComponent } from '../pages/rescueRank/rescue-rank.component';
import { RescueSiteComponent } from '../pages/rescueSite/rescue-site.component';
import { IllegalComponent } from '../pages/illegal/illegal';
import { InsuranceComponent } from '../pages/insurance/insurance';
import { IllegalDetailComponent } from '../pages/illegalDetail/illegalDetail';

@NgModule({
    declarations : [
        AppComponent,
        HomeComponent,
        DetailComponent,
        MapComponent,
        UserComponent,
        IndexComponent,
        UserInfoComponent,
        UserSellerComponent,
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
        OrderDetailComponent,

        FocusBlurDirective,

        KeysPipe,
        DistancePipe,
        PlateFormatPipe,
        StarHiddenPipe,

        NotifyComponent,
        CategoryComponent,
        NotifyDetailComponent,
        RedirectComponent,
        LoginComponent,
        EditOrderComponent,
        RescueComponent,
        RescueDetailComponent,
        RescueRankComponent,
        RescueSiteComponent,
        IllegalComponent,
        InsuranceComponent,
        IllegalDetailComponent
    ],
    imports      : [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        WeUiModule.forRoot(),
        NgxAmapModule.forRoot({
            //apiLibraries:['geometry'],
            apiKey : config.apiKey // 'RO6BZ-4HGWX-4CC4F-ZY4JK-KUFPE-DJBPC' // app key为必选项
        }),
        TabsModule
    ],
    providers    : [MessageService, LocalStorage, WXSDKService, /*WXService,*/ CustomValidators, BaseProvider, AuthGuard, AuthService, ImageTypeList, PaymentTypeList, IdentityAuthService, RefreshMemberInfoService],
    bootstrap    : [AppComponent]
})
export class AppModule {
}
