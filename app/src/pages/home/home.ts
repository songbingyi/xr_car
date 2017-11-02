import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

import {WXService} from '../../providers/wx.service';

import {ProductProvider} from '../../providers/http/product.http';

import {ProductsModel} from '../../models/product.model';
import {ProductModel} from '../../models/product.model';

import {InfiniteLoaderComponent} from 'ngx-weui/infiniteloader';

import {Observable} from 'rxjs/Rx';

@Component({
    selector    : 'app-home',
    templateUrl : './home.html',
    styleUrls   : ['./home.scss'],
    providers   : [ProductProvider]
})
export class HomeComponent implements OnInit {

    products : ProductModel[] = [];
    errorMessage : any;
    isLoading: Boolean = false;
    isLoaded: Boolean = false;

    @ViewChild(InfiniteLoaderComponent) il;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private wxService : WXService, private productService : ProductProvider) {
    }

    status : string;

    ngOnInit() {
        this.loadProducts();
        this.configWX();
    }

    configWX() {
        this.wxService.config({
            title : '新标题'
        }).then(() => {
            // 其它操作，可以确保注册成功以后才有效
            this.status = '注册成功';
        }).catch((err : string) => {
            this.status = `注册失败，原因：${err}`;
        });
    }

    loadProducts(callbackDone?, callbackOnce?) {
        this.productService.getProducts('product.mock.json').subscribe(products => {
                this.products = this.products.concat(products.row);

                this.isLoading = false;
                this.isLoaded  = true;

                if ((products.total <= this.products.length) && !!callbackDone) {
                    return callbackDone();
                }

                if (callbackOnce) {
                    callbackOnce();
                }

            },
            error => this.errorMessage = <any>error
        );
    }

    onLoadMore(comp: InfiniteLoaderComponent) {
        if (this.isLoading) {
            return ;
        }
        this.isLoading = true;
        this.loadProducts(() => {
            comp.setFinished();
        }, () => {
            comp.resolveLoading();
        });

    }

    goTop() {
        console.log(this.myScrollContainer.nativeElement.scrollTop);
        try {
            this.myScrollContainer.nativeElement.scrollIntoView(); // this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

}
