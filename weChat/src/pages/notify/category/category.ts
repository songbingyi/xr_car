import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrls: ['./category.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {
      let category = this.route.snapshot.paramMap.get('category');
      console.log(category);
  }

}
