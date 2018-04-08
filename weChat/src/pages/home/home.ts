import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {WXService} from '../../providers/wx.service';

import {BaseProvider} from '../../providers/http/base.http';
import {LocalStorage} from '../../providers/localStorage';

import {ProductsModel} from '../../models/product.model';
import {ProductModel} from '../../models/product.model';

import {InfiniteLoaderComponent} from 'ngx-weui/infiniteloader';

import {Observable} from 'rxjs/Rx';
import {MessageService} from '../../providers/messageService';

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

    show: Boolean = false;

    serviceTypes: any = [];

    @ViewChild(InfiniteLoaderComponent) il;
    @ViewChild('scrollMe') private myScrollContainer : ElementRef;

    constructor(private baseService: BaseProvider, private router : Router, private localStorage: LocalStorage, private message: MessageService) {
        this.message.getMessage().subscribe(msg => {
            if(msg.type === 'refresh'){
                this.refresh();
            }
        });
    }

    status : string;

    ngOnInit() {
        this.baseService.post('getServiceTypeList', {})
            .subscribe(serviceTypes => {
                if (serviceTypes.status.succeed === '1') {
                    this.serviceTypes = serviceTypes.data.service_type_list;
                } else {
                    this.errorMessage = serviceTypes.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
        this.loadProducts();
    }

    ngAfterViewInit() {
        // this.bindEvent();
    }

    loadProducts(callbackDone?, callbackOnce?) {
        this.baseService.post('getCarProductList', {
            pagination: this.pagination
        }).subscribe(products => {
                if (products.status.succeed === '1') {
                    // console.log(products);
                    this.products = this.products.concat(products.data.car_product_list);

                    this.isLoading = false;
                    this.isLoaded = true;

                    this.bindEvent();

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

    refresh() {
        this.pagination.page = 1;
        this.goTop();
        this.loadProducts();
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
        if (serviceType.service_type_status === '2') {
            this.localStorage.setObject(serviceType.service_type_key, serviceType);
            this.router.navigate([serviceType.service_type_key]);
        }
    }

    goTop() {
        try {
            this.myScrollContainer.nativeElement.scrollIntoView(); // this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

    bindEvent() {
        let $body = document.querySelector('body');
        let height = $body.clientHeight || $body.offsetHeight;
        setTimeout(() => {
            let content = document.querySelector('.weui-infiniteloader__content');
             // console.log(content);
            if(content) {
                content.addEventListener('scroll', (event) => {
                    let scrollTop = content.scrollTop;
                    if( scrollTop > height){
                        this.show = true;
                    }else{
                        this.show = false;
                    }
                    // console.log(content.scrollTop);
                });
            }
        },0)
    }

}
