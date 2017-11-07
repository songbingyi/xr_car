import {Injectable} from '@angular/core';
import {Http, Response, Headers/*, BaseRequestOptions*/} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {config} from '../../app/app.config';

import {apiBase} from '../../providers/api.config';

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

    private setHeader() {
        this.headers = new Headers();
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }

    get(name: any): Observable<any> {
        let url = this.getApi(name);
        this.setHeader();
        return this.http.get(url, {
            headers: this.headers
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getApi(name) {
        let url = '';
        // let url = config.production ? (this.url + apiBase[name]) : (this.url + name + '.mock.json');
        if (config.production) {
            url = this.url + apiBase[name] + this.access_token;
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
