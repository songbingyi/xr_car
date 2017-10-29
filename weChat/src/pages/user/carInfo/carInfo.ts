import {Component, OnInit} from '@angular/core';

@Component({
    selector    : 'app-car-info',
    templateUrl : './carInfo.html',
    styleUrls   : ['./carInfo.scss']
})
export class CarInfoComponent implements OnInit {

    showPanel: Boolean = false;
    isShowImage: Boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    showImage() {
        this.isShowImage = !this.isShowImage;
    }

    onItemChange(data: any) {
        console.log('onItemChange', data);
    }
    onItemGroupChange(data: any) {
        console.log('onItemGroupChange', data);
    }
    onItemCancel() {
        console.log('onItemCancel');
    }
}
