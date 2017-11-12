import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';

// declare const Swiper: any;

@Component({
    selector    : 'app-detail',
    templateUrl : './detail.html',
    styleUrls   : ['./detail.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {

    errorMessage: any;
    product: any = {};
    isLoaded: Boolean = false;

    // @ViewChild('wuiSwiper') Swiper;

    options: any = {
        roundLengths : true,
        initialSlide : 0,
        speed: 300,
        slidesPerView: 'auto',
        centeredSlides : true,
        followFinger : false,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        onInit: () => {

        },
        onSlideChangeEnd: (swiper: any) => {

        }
    };

    images: any = [];

    constructor(private route : ActivatedRoute, private router : Router, private baseProvider : BaseProvider) {

    }

    ngOnInit() {

        let id = this.route.snapshot.paramMap.get('id');
        this.loadProduct(id);
        /*this.routes.paramMap.switchMap((params : ParamMap) => {
            console.log(params.get('id'));
        });*/
    }

    /*loadSwiper () {
        new Swiper('.swiper-container', {
            roundLengths : true,
            initialSlide : 0,
            speed: 300,
            slidesPerView: 'auto',
            centeredSlides : true,
            followFinger : false,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            }
        });
    }*/

    loadProduct(id) {
        this.baseProvider.get('getCarProductDetail'/*, {'product_id': id}*/).subscribe(product => {
                if (product.status.succeed) {
                    this.product = product.data.car_product_info;
                    this.getImagesList(this.product.product_image_list);
                    this.isLoaded = true;
                } else {
                    this.errorMessage = product.status.error_desc;
                }
            },
            error => this.errorMessage = <any>error
        );
    }

    getImagesList(images) {
        let items = [];
        images.forEach( image => {
            let tmp = {
                url : image.thumb,
                title : ''
            };
            items.push(tmp);
        });

        this.images = items;
        // this.loadSwiper();
        // this.swipers = (<SwiperComponent>this.swipers);
        // console.log(this.Swiper.swiper);
        // console.log(imgs);
        // this.Swiper.swiper.update();
    }

}
