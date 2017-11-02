import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pay-complete',
  templateUrl: './payComplete.html',
  styleUrls: ['./payComplete.scss']
})
export class PayCompleteComponent implements OnInit {
    isSuccess: Boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
