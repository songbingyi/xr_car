import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    selector    : 'app-detail',
    templateUrl : './detail.html',
    styleUrls   : ['./detail.scss']
})
export class DetailComponent implements OnInit {

    constructor(private route : ActivatedRoute, private router : Router) {
    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        console.log(id);
        /*this.route.paramMap.switchMap((params : ParamMap) => {
            console.log(params.get('id'));
        });*/
    }

}
