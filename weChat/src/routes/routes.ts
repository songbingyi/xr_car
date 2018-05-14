import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// import {PageNotFoundComponent} from './not-found.component';
import {IndexComponent} from '../pages/index/';

import { AuthGuard } from '../providers/auth-guard.service';


import {AppComponent} from '../app/app.component';
import {HomeComponent} from '../pages/home/home';
import {DetailComponent} from '../pages/product/detail/detail';
import {CartComponent} from '../pages/product/cart/cart';
import {MapComponent} from '../pages/map/map';
import {UserComponent} from '../pages/user/user';
import {AboutComponent} from '../pages/user/about/about';
import {ContactComponent} from '../pages/user/contact/contact';
import {UserInfoComponent} from '../pages/user/userInfo/userInfo';
import {AchievementComponent} from '../pages/user/achievement/achievement';
import {UserSellerComponent} from '../pages/user/userSeller/userSeller';
import {CarInfoComponent} from '../pages/user/carInfo/carInfo';
import {CarListComponent} from '../pages/user/carList/carList';

import {NotifyComponent} from '../pages/notify/notify';
import {CategoryComponent} from '../pages/notify/category/category';
import {NotifyDetailComponent} from '../pages/notify/detail/detail';

import {CertificateComponent} from '../pages/certificate/certificate';
import {LicenseComponent} from '../pages/license/license';
import {ReviewComponent} from '../pages/review/review';
import {IllegalComponent} from '../pages/illegal/illegal';
import {IllegalDetailComponent} from '../pages/illegalDetail/illegalDetail';
import {InsuranceComponent} from '../pages/insurance/insurance';

import {OrdersComponent} from '../pages/serviceOrder/orders';
import {OrderDetailComponent} from '../pages/serviceOrder/orderDetail/orderDetail';
import {OrderCancelComponent} from '../pages/serviceOrder/orderCancel/orderCancel';
import {OrderCompleteComponent} from '../pages/serviceOrder/orderComplete/orderComplete';
import {EditOrderComponent} from '../pages/serviceOrder/editOrder/editOrder';
import {ConfirmOrderComponent} from '../pages/serviceOrder/confirmOrder/confirmOrder';

import {ProductOrderComponent} from '../pages/productOrder/product.order';
import {ProductOrderDetailComponent} from '../pages/productOrder/orderDetail/orderDetail';
import {ProductOrderCompleteComponent} from '../pages/productOrder/orderComplete/orderComplete';


import {MailComponent} from '../pages/serviceOrder/mail/mail';

import {PaymentComponent} from '../pages/pay/payment/payment';
import {RefundComponent} from '../pages/pay/refund/refund';
import {PayCompleteComponent} from '../pages/pay/payComplete/payComplete';


import { RedirectComponent } from '../pages/redirect/redirect';
import { LoginComponent } from '../pages/login/login';

import { RescueComponent } from '../pages/rescue/rescue.component';
import { RescueDetailComponent } from '../pages/rescueDetail/rescue-detail.component';
import { RescueSiteComponent } from '../pages/rescueSite/rescue-site.component';
import { RescueRankComponent } from '../pages/rescueRank/rescue-rank.component';


const appRoutes: Routes = [
    {path : 'wx', component : RedirectComponent},
    {path : 'login', component : LoginComponent},
    {path : '', component : IndexComponent},
    {path : 'service_operation_certificate', component : CertificateComponent, canActivate: [AuthGuard]},
    {path : 'service_driving_license', component : LicenseComponent, canActivate: [AuthGuard]},
    {path : 'service_audit_car', component : ReviewComponent, canActivate: [AuthGuard]},
    {path : 'service_car_regulations', component : IllegalComponent, canActivate: [AuthGuard]},
    {path : 'service_car_regulations/:id', component : IllegalDetailComponent, canActivate: [AuthGuard]},
    {path : 'service_car_insurance', component : InsuranceComponent, canActivate: [AuthGuard]},
    {path : 'detail/:id', component : DetailComponent},
    {path : 'cart/:id', component : CartComponent},
    {path : 'maps', component : MapComponent},
    {path : 'user', component : UserComponent, canActivate: [AuthGuard]},
    {path : 'serviceOrder/:status/:page', component : OrdersComponent, canActivate: [AuthGuard]},
    {path : 'productOrder/:status/:page', component : ProductOrderComponent, canActivate: [AuthGuard]},
    {path : 'orderDetail/:id', component : OrderDetailComponent, canActivate: [AuthGuard]},
    {path : 'productOrderDetail/:id', component : ProductOrderDetailComponent, canActivate: [AuthGuard]},
    {path : 'productOrderComplete/:id', component : ProductOrderCompleteComponent, canActivate: [AuthGuard]},
    {path : 'editOrder/:id', component : EditOrderComponent, canActivate: [AuthGuard]},
    {path : 'cancelOrder/:id', component : OrderCancelComponent, canActivate: [AuthGuard]},
    {path : 'completeOrder/:id', component : OrderCompleteComponent, canActivate: [AuthGuard]},
    {path : 'confirmOrder/:id', component : ConfirmOrderComponent, canActivate: [AuthGuard]},
    {path : 'mail', component : MailComponent, canActivate: [AuthGuard]},
    {path : 'payment', component : PaymentComponent, canActivate: [AuthGuard]},
    {path : 'refund/:id', component : RefundComponent, canActivate: [AuthGuard]},
    {path : 'payComplete/:id', component : PayCompleteComponent, canActivate: [AuthGuard]},
    {path : 'about', component : AboutComponent, canActivate: [AuthGuard]},
    {path : 'contact', component : ContactComponent, canActivate: [AuthGuard]},
    {path : 'userInfo', component : UserInfoComponent, canActivate: [AuthGuard]},
    {path : 'achievement', component : AchievementComponent, canActivate: [AuthGuard]},
    {path : 'userSeller', component : UserSellerComponent, canActivate: [AuthGuard]},
    {path : 'carInfo', component : CarInfoComponent, canActivate: [AuthGuard]},
    {path : 'carList', component : CarListComponent, canActivate: [AuthGuard]},
    {path : 'rescue', component : RescueComponent, canActivate: [AuthGuard]},
    {path : 'rescueDetail/:id', component : RescueDetailComponent},
    {path : 'rescueSite/:id', component : RescueSiteComponent},
    {path : 'rescueRank/:id', component : RescueRankComponent, canActivate: [AuthGuard]},
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
