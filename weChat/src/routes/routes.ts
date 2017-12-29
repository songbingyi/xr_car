import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// import {PageNotFoundComponent} from './not-found.component';
import {IndexComponent} from '../pages/index/index';

import { AuthGuard } from '../providers/auth-guard.service';


import {AppComponent} from '../app/app.component';
import {HomeComponent} from '../pages/home/home';
import {DetailComponent} from '../pages/product/detail/detail';
import {MapComponent} from '../pages/map/map';
import {UserComponent} from '../pages/user/user';
import {AboutComponent} from '../pages/user/about/about';
import {ContactComponent} from '../pages/user/contact/contact';
import {UserInfoComponent} from '../pages/user/userInfo/userInfo';
import {CarInfoComponent} from '../pages/user/carInfo/carInfo';
import {CarListComponent} from '../pages/user/carList/carList';

import {NotifyComponent} from '../pages/notify/notify';
import {CategoryComponent} from '../pages/notify/category/category';
import {NotifyDetailComponent} from '../pages/notify/detail/detail';

import {CertificateComponent} from '../pages/certificate/certificate';
import {LicenseComponent} from '../pages/license/license';
import {ReviewComponent} from '../pages/review/review';

import {OrdersComponent} from '../pages/orders/orders';
import {OrderDetailComponent} from '../pages/orders/orderDetail/orderDetail';
import {EditOrderComponent} from '../pages/orders/editOrder/editOrder';
import {ConfirmOrderComponent} from '../pages/orders/confirmOrder/confirmOrder';

import {MailComponent} from '../pages/orders/mail/mail';

import {PaymentComponent} from '../pages/pay/payment/payment';
import {RefundComponent} from '../pages/pay/refund/refund';
import {PayCompleteComponent} from '../pages/pay/payComplete/payComplete';


import { RedirectComponent } from '../pages/redirect/redirect';
import { LoginComponent } from '../pages/login/login';

const appRoutes: Routes = [
    {path : 'wx', component : RedirectComponent},
    {path : 'login', component : LoginComponent},
    {path : '', component : IndexComponent},
    {path : 'service_operation_certificate', component : CertificateComponent, canActivate: [AuthGuard]},
    {path : 'service_driving_license', component : LicenseComponent, canActivate: [AuthGuard]},
    {path : 'service_audit_car', component : ReviewComponent, canActivate: [AuthGuard]},
    {path : 'detail/:id', component : DetailComponent},
    {path : 'maps', component : MapComponent},
    {path : 'user', component : UserComponent, canActivate: [AuthGuard]},
    {path : 'orders/:status/:page', component : OrdersComponent, canActivate: [AuthGuard]},
    {path : 'orderDetail/:id', component : OrderDetailComponent, canActivate: [AuthGuard]},
    {path : 'editOrder/:id', component : EditOrderComponent, canActivate: [AuthGuard]},
    {path : 'confirmOrder/:id', component : ConfirmOrderComponent, canActivate: [AuthGuard]},
    {path : 'mail', component : MailComponent, canActivate: [AuthGuard]},
    {path : 'payment', component : PaymentComponent, canActivate: [AuthGuard]},
    {path : 'refund/:id', component : RefundComponent, canActivate: [AuthGuard]},
    {path : 'payComplete/:id', component : PayCompleteComponent, canActivate: [AuthGuard]},
    {path : 'about', component : AboutComponent, canActivate: [AuthGuard]},
    {path : 'contact', component : ContactComponent, canActivate: [AuthGuard]},
    {path : 'userInfo', component : UserInfoComponent, canActivate: [AuthGuard]},
    {path : 'carInfo', component : CarInfoComponent, canActivate: [AuthGuard]},
    {path : 'carList', component : CarListComponent, canActivate: [AuthGuard]},
    {path : 'notify', component : NotifyComponent, canActivate: [AuthGuard]},
    {path : 'notifyCat/:category', component : CategoryComponent, canActivate: [AuthGuard]},
    {path : 'notifyDetail/:id', component : NotifyDetailComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports : [
        RouterModule.forRoot(
            appRoutes,
            {enableTracing : false} // <-- debugging purposes only
        )
    ],
    exports : [
        RouterModule
    ]
})
export class AppRoutingModule {
}
