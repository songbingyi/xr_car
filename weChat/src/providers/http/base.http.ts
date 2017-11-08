import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {config} from '../../app/app.config';

import {apiBase} from '../../providers/api.config';
import {detachProjectedView} from "@angular/core/src/view/view_attach";

/*
 Generated class for the Events provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class BaseProvider {

    url = config.prefix;
    access_token = 'SASMAL36SKLASKLAMSJKA980D';

    constructor(public http: Http) {
        console.log('Hello Events Provider');
    }

    headers: any;

    defaultHeader: any = {
        'X-Requested-With' : 'XMLHttpRequest',
        'Content-Type': 'application/json'
    };

    private getHeaders(object = this.defaultHeader) {
        let headers = new Headers();
        for (let key in object) {
            if ( object.hasOwnProperty(key) ) {
                headers.append(key, object[key]);
            }
        }
        // headers.append('X-Requested-With', 'XMLHttpRequest');
        // headers.append('Content-Type', 'application/json');
        return headers;
    }

    private getOptions(options) {
        return new RequestOptions(options);
    }

    get(name: any): Observable<any> {
        let url = this.getApi(name);
        let headers = this.getHeaders();
        let options = this.getOptions({headers: headers});
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    post(name: any, data: any) {
        let url = this.getApi(name);
        let headers = this.getHeaders();
        let options = this.getOptions({headers: headers});
        return this.http.post(url, data, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getApi(name) {
        let url = '';
        // let url = config.production ? (this.url + apiBase[name]) : (this.url + name + '.mock.json');
        if (config.production) {
            url = this.url + apiBase[name] + '?access_token=' + this.access_token;
        } else {
            url = this.url + name + '.mock.json';
        }

        return url;
    }

    private extractData(res: Response) {

        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
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
