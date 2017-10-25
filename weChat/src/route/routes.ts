import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


// import {PageNotFoundComponent} from './not-found.component';
import {IndexComponent} from '../pages/index/index';


import {AppComponent} from '../app/app.component';
import {HomeComponent} from '../pages/home/home';
import {DetailComponent} from '../pages/detail/detail';
import {MapComponent} from '../pages/map/map';
import {UserComponent} from '../pages/user/user';
import {AboutComponent} from '../pages/about/about';
import {ContactComponent} from '../pages/contact/contact';
import {UserInfoComponent} from '../pages/userInfo/userInfo';
import {CarInfoComponent} from '../pages/carInfo/carInfo';


import {CertificateComponent} from '../pages/certificate/certificate';
import {LicenseComponent} from '../pages/license/license';
import {ReviewComponent} from '../pages/review/review';

import {OrdersComponent} from '../pages/orders/orders';

const appRoutes: Routes = [
    {path : '', component : IndexComponent},
    {path : 'certificate', component : CertificateComponent},
    {path : 'license', component : LicenseComponent},
    {path : 'review', component : ReviewComponent},
    {path : 'detail/:id', component : DetailComponent},
    {path : 'maps', component : MapComponent},
    {path : 'user', component : UserComponent},
    {path : 'orders/:status', component : OrdersComponent},
    {path : 'about', component : AboutComponent},
    {path : 'contact', component : ContactComponent},
    {path : 'userInfo', component : UserInfoComponent},
    {path : 'carInfo', component : CarInfoComponent}
];

@NgModule({
    imports : [
        RouterModule.forRoot(
            appRoutes,
            {enableTracing : true} // <-- debugging purposes only
        )
    ],
    exports : [
        RouterModule
    ]
})
export class AppRoutingModule {
}
