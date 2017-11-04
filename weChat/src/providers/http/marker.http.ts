import {Injectable} from '@angular/core';
import {Http, Response, Headers/*, BaseRequestOptions*/} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {MarkerModel} from '../../models/marker.model';


import {config} from '../../app/app.config';

/*
 Generated class for the Markers provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class MarkersProvider {

    url = config.prefix;

    constructor(public http: Http) {
        console.log('Hello Markers Provider');
    }

    headers: any;

    private setHeader() {
        this.headers = new Headers();
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }

    getMakers(path: String): Observable<MarkerModel[]> {
        this.setHeader();
        return this.http.get(this.url + path, {
            headers: this.headers
        })
            .map(this.extractData)
            .catch(this.handleError);
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
