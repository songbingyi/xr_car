import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    selector    : 'app-detail',
    templateUrl : './detail.html',
    styleUrls   : ['./detail.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {

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

    images: any[] = [
        { url: '/assets/images/tmp/detail.w.png', title: '标题1' },
        { url: '/assets/images/tmp/detail.w.png', title: '标题2' },
        { url: '/assets/images/tmp/detail.w.png', title: '标题3' }
    ];

    constructor(private route : ActivatedRoute, private router : Router) {
    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        console.log(id);
        /*this.routes.paramMap.switchMap((params : ParamMap) => {
            console.log(params.get('id'));
        });*/
    }

}
