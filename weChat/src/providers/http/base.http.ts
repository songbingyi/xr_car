import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

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

    url = config.prefix;
    access_token = '';

    constructor(public http : Http, private authService: AuthService) {
        console.log('Hello Base Provider');
        this.access_token = this.authService.getAccessToken();
    }

    headers : any;

    defaultHeader : any = {
        'X-Requested-With' : 'XMLHttpRequest',
        'Content-Type'     : 'application/json'
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
        let url = this.getApi(name);
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
        return data;
    }

    post(name : any, data : any) {
        let url = config.prefix + '?access_token=' + this.access_token;
        let path = this.getApi(name);
        let headers = this.getHeaders();
        let options = this.getOptions({headers : headers});

        return this.http.post(url, {
            route          : path,
            token          : this.access_token,
            jsonText       : JSON.stringify(this.setMemberId(data)),
            device_type    : '',
            device_version : '',
            version_code   : '',
            channel        : '',
        }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getApi(name) {
        let url = '';
        if (config.production) {
            url = apiBase[name];
        } else {
            url = mockBase[name];
        }
        return url;
    }

    private extractData(res : Response) {
        let body = res.json();
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
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


}
