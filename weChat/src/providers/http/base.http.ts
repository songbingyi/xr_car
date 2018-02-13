import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {config} from '../../app/app.config';

import {apiBase} from '../api.config';
import {mockBase} from '../mock.config';
import {detachProjectedView} from '@angular/core/src/view/view_attach';

import { AuthService } from '../auth.service';

/*
 Generated class for the Events provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class BaseProvider {

    url = config.api;
    access_token = '';

    static self: any;

    constructor(public http : Http, private authService: AuthService) {
        // console.log('Hello Base Provider');
        // console.log('this.access_token');
        // console.log(this.access_token);
        BaseProvider.self = this;
    }

    headers : any;

    defaultHeader : any = {
         'X-Requested-With' : 'XMLHttpRequest',
         'Content-Type'     : 'application/x-www-form-urlencoded'
    };

    private getHeaders(object = this.defaultHeader) {
        let headers = new Headers();
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                headers.append(key, object[key]);
            }
        }
        return headers;
    }

    private getOptions(options) {
        return new RequestOptions(options);
    }

    get(name : any) : Observable<any> {
        let url = apiBase[name];
        let headers = this.getHeaders();
        let options = this.getOptions({headers : headers});
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    setMemberId(data) {
        let member_id = this.authService.getMemberId();
        if (member_id) {
            data.member_id = member_id;
        }
        return JSON.parse(JSON.stringify(data));
    }

    setSearchParams(path, data, ignore?) {
        this.access_token = this.authService.getToken() || '';
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('route', path);
        if(!ignore){
            urlSearchParams.append('token', this.access_token || 'this is a fake access_token for forbidden access in browser');
            let newData = this.setMemberId(data);
            newData.member_id = newData.member_id || 'this is a fake member_id for forbidden access in browser';
            urlSearchParams.append('jsonText', JSON.stringify(newData));
        }else{
            urlSearchParams.append('jsonText', JSON.stringify(data));
        }
        urlSearchParams.append('device_type', '40');
        urlSearchParams.append('device_version', '1.0');
        urlSearchParams.append('version_code', '1');
        urlSearchParams.append('channel', '10001');
        return urlSearchParams;
    }

    post(name : any, data : any, isTest?, ignore?) {
        this.access_token = this.authService.getToken() || '';
        let url = this.url + '?access_token=' + this.access_token;
        let route = apiBase[name];
        let headers = this.getHeaders();
        let options = this.getOptions({headers : headers});
        let urlSearchParams = this.setSearchParams(route, data, ignore);

        /*if (isTest) {
            url = 'http://218.244.158.175/xr_car_server/api_client/index.php' + '?access_token=' + this.access_token;
        }*/

        if (config.production) {
            url = url + '&route=' + route;
        }

        // console.log("POST");

        return this.http.post(url, urlSearchParams, options)
            .timeout(5000)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*getApi(name) {
        let url = '';
        if (config.production) {
            url = apiBase[name];
        } else {
            url = mockBase[name];
        }
        return url;
    }*/

    private extractData(res : Response) {
        let body = res.json();
        // console.log(body);
        // alert(JSON.stringify(body));
        // 整体判断是否登录信息过期。
        if (body.status.error_code === '2002') {
            BaseProvider.self.authService.redirect();
            return {};
        }
        return body || {};
    }

    private handleError(error : Response | any) {
        let errMsg : string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        // console.error(errMsg);
        return Observable.throw(errMsg);
    }


}
