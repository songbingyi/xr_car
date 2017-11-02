import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


// import {PageNotFoundComponent} from './not-found.component';
import {IndexComponent} from '../pages/index/index';


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

import {CertificateComponent} from '../pages/certificate/certificate';
import {LicenseComponent} from '../pages/license/license';
import {ReviewComponent} from '../pages/review/review';

import {OrdersComponent} from '../pages/orders/orders';
import {OrderDetailComponent} from '../pages/orders/orderDetail/orderDetail';
import {ConfirmOrderComponent} from '../pages/orders/confirmOrder/confirmOrder';

import {MailComponent} from '../pages/orders/mail/mail';

import {PaymentComponent} from '../pages/pay/payment/payment';
import {RefundComponent} from '../pages/pay/refund/refund';
import {PayCompleteComponent} from '../pages/pay/payComplete/payComplete';

const appRoutes: Routes = [
    {path : '', component : IndexComponent},
    {path : 'certificate', component : CertificateComponent},
    {path : 'license', component : LicenseComponent},
    {path : 'review', component : ReviewComponent},
    {path : 'detail/:id', component : DetailComponent},
    {path : 'maps', component : MapComponent},
    {path : 'user', component : UserComponent},
    {path : 'orders/:status', component : OrdersComponent},
    {path : 'orderDetail/:id', component : OrderDetailComponent},
    {path : 'confirmOrder/:id', component : ConfirmOrderComponent},
    {path : 'mail', component : MailComponent},
    {path : 'payment/:id', component : PaymentComponent},
    {path : 'refund/:id', component : RefundComponent},
    {path : 'payComplete/:id', component : PayCompleteComponent},
    {path : 'about', component : AboutComponent},
    {path : 'contact', component : ContactComponent},
    {path : 'userInfo', component : UserInfoComponent},
    {path : 'carInfo', component : CarInfoComponent},
    {path : 'carList', component : CarListComponent},
    {path : 'notify', component : NotifyComponent}
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
