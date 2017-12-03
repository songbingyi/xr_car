import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { BaseProvider } from './http/base.http';

declare const wx: any;

@Injectable()
export class ImageTypeList {

    imageTypeMap : any;
    errorMessage : any;

    constructor(private http: Http, private baseService: BaseProvider) {
        this.init();
    }

    init() {
        if (!this.imageTypeMap) {
            this.loadImageTypeList();
        }
    }

    loadImageTypeList() {
        this.baseService.post('getImageTypeList', {})
            .subscribe(imageTypeMap => {
                if (imageTypeMap.status.succeed) {
                    this.imageTypeMap = imageTypeMap.data.image_type_list;
                    // console.log(this.imageTypeMap);
                } else {
                    this.errorMessage = imageTypeMap.status.error_desc;
                }
            }, error => this.errorMessage = <any>error);
    }

    getTypeByKey(key) {
        let imageTypeMap = this.imageTypeMap;
        let len          = imageTypeMap.length;
        for (let i = 0; i < len; i++) {
            let imageType = imageTypeMap[i];
            if (imageType.image_type_key === key) {
                let result = JSON.parse(JSON.stringify(imageType));
                delete result.image_type_name;
                return result;
            }
        }
    }

}
