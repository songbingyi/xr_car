import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {BaseProvider} from '../../../providers/http/base.http';
import {IdentityAuthService} from '../../../providers/identityAuth.service';

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
    show: Boolean = false;

    shouldShowWarningBox:Boolean = true;
    wechatClientConfig:any = {};

    @ViewChild('scrollMe') private myScrollContainer : ElementRef;

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

    constructor(private route : ActivatedRoute, private router : Router, private baseService : BaseProvider, private identityAuthService:IdentityAuthService) {
        this.identityAuthService.check();
        this.getWechatClientConfig();
    }

    ngOnInit() {

        let id = this.route.snapshot.paramMap.get('id');
        this.loadProduct(id);
        /*this.routes.paramMap.switchMap((params : ParamMap) => {
            console.log(params.get('id'));
        });*/
    }

    getWechatClientConfig() {
        this.baseService.post('getWechatClientConfig', {}).subscribe(wechatClientConfig => {
            if (wechatClientConfig.status.succeed === '1') {
                this.wechatClientConfig = wechatClientConfig.data.wechat_client_config;
                this.shouldShowWarningBox = wechatClientConfig.data.wechat_client_config.is_tips_bind_car_notice !== '1';
            } else {
                this.errorMessage = wechatClientConfig.status.error_desc;
            }
        }, error => this.errorMessage = <any>error);
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
        this.baseService.post('getCarProductDetail', {'product_id': id}).subscribe(product => {
                if (product.status.succeed === '1') {
                    this.product = product.data.car_product_info;
                    this.getImagesList(this.product.product_image_list);
                    this.isLoaded = true;
                    this.bindEvent();
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

    toCart() {
        if(this.product.is_can_order === '0'){
            return;
        }
        if(this.wechatClientConfig.is_tips_join_user_salesman === '0'){
            this.shouldShowWarningBox = false;
            return;
        }
        this.router.navigate(['cart', this.product.product_id], { queryParams: { product_id: this.product.product_id } });
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
            let content = document.querySelector('.scroll-page');
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

    iSee(){
        this.shouldShowWarningBox = !this.shouldShowWarningBox;
    }
    goToCarList(){
        this.router.navigate(['/carList']);
    }
    goToEBoss(){
        // 如果是销售员(不提示成为 Eboss )则跳转到 E04-2，否则跳转到 E11-1
        if(this.wechatClientConfig.is_tips_join_user_salesman === '0'){
            this.router.navigate(['/userInfo']);
        }else{
            this.router.navigate(['/eboss']);
        }

    }

}
