import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector    : 'app-certificate',
    templateUrl : './certificate.html',
    styleUrls   : ['./certificate.scss'],
    encapsulation : ViewEncapsulation.None
})
export class CertificateComponent implements OnInit {

    shouldReservation : Boolean = false;
    shouldReservationBox : Boolean = true;

    items : Array<any> = [
        {
            id : 1,
            cardType : '公户',
            carType  : '大型汽车',
            cardId   : '陕A·76243',
            isChecked : false
        }, {
            id : 2,
            cardType : '公户',
            carType  : '大型汽车',
            cardId   : '陕A·76243',
            isChecked : false
        },
        {
            id : 3,
            cardType : '公户',
            carType  : '大型汽车',
            cardId   : '陕A·76243',
            isChecked : false
        }
    ];

    showNext : Boolean = false;

    res : any = {
        checkbox : '',
        item : null
    };


    itemsRadio: string[] = Array(10).fill('').map((v: string, idx: number) => `咸阳新盛检测站-${idx}`);


    constructor(private router : Router) {
        // this.res.checkbox = [this.items[0]];
    }

    onSave() {
        console.log('请求数据：' + JSON.stringify(this.res));
    }

    ngOnInit() {
    }

    onchange($event, item) {
        console.log($event, item);
        // let checkbox = this.res.checkbox;
        // let length = checkbox.length;
        this.res.checkbox = item; // checkbox.slice([length - 1], 1);
        item.isChecked = true;
        console.log(this.res.checkbox);
        return false;
    }

    onTabSelect(event) {
        console.log(event);
        if (event === false) {
            this.shouldReservationBox = false;
            console.log('需要填写信息！');
        }
        return false;
    }

    next() {
        this.showNext = !this.showNext;
        this.onSave();
    }

    goToUser() {
        this.router.navigate(['/userInfo']);
    }

}
