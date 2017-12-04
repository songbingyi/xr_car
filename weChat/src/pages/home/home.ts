import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {WXService} from '../../providers/wx.service';

import {BaseProvider} from '../../providers/http/base.http';
import {LocalStorage} from '../../providers/localStorage';

import {ProductsModel} from '../../models/product.model';
import {ProductModel} from '../../models/product.model';

import {InfiniteLoaderComponent} from 'ngx-weui/infiniteloader';

import {Observable} from 'rxjs/Rx';

@Component({
    selector    : 'app-home',
    templateUrl : './home.html',
    styleUrls   : ['./home.scss'],
    providers   : [BaseProvider]
})
export class HomeComponent implements OnInit {
    pagination= {
        page : 1,
        count: 10
    };
    products : any = [];
    errorMessage : any;
    isLoading : Boolean = false;
    isLoaded : Boolean = false;

    serviceTypes: any = [];

    @ViewChild(InfiniteLoaderComponent) il;
    @ViewChild('scrollMe') private myScrollContainer : ElementRef;

    constructor(private baseService: BaseProvider, private router : Router, private localStorage: LocalStorage) {
    }

    status : string;

    ngOnInit() {
        this.baseService.post('getServiceTypeList', {})
            .subscribe(serviceTypes => {
                if (serviceTypes.status.succeed === '1') {
                    this.serviceTypes = serviceTypes.data.service_type_list;
                    console.log(this.serviceTypes);
                } else {
                    this.errorMessage = serviceTypes.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
        this.loadProducts();
    }

    loadProducts(callbackDone?, callbackOnce?) {
        this.baseService.post('getCarProductList', {
            pagination: this.pagination
        }).subscribe(products => {
                if (products.status.succeed === '1') {
                    console.log(products);
                    this.products = this.products.concat(products.data.car_product_list);

                    this.isLoading = false;
                    this.isLoaded = true;

                    if ((products.paginated.more === '0') && !!callbackDone) {
                        return callbackDone();
                    }

                    if (callbackOnce) {
                        callbackOnce();
                    }
                } else {
                    this.errorMessage = products.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    onLoadMore(comp : InfiniteLoaderComponent) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.pagination.page ++ ;
        this.loadProducts(() => {
            comp.setFinished();
        }, () => {
            comp.resolveLoading();
        });

    }

    goModule(serviceType) {
        this.localStorage.setObject(serviceType.service_type_key, serviceType);
        this.router.navigate([serviceType.service_type_key]);
    }

    goTop() {
        // console.log(this.myScrollContainer.nativeElement.scrollTop);
        try {
            this.myScrollContainer.nativeElement.scrollIntoView(); // this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

}
