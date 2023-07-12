import { Component, OnInit } from '@angular/core';
import { SharedService } from '../SharedResources/Services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shippingpolicy',
  templateUrl: './shippingpolicy.component.html',
  styleUrls: ['./shippingpolicy.component.css']
})
export class ShippingpolicyComponent implements OnInit {

  constructor(private shared:SharedService) { 
    this.subscriptions.push(this.shared.currentFooterData.subscribe((data:any) => {
      this.footer_data=data.utility;
  }))
  }
  subscriptions:Subscription[]=[];
    footer_data:any=[];

  ngOnInit(): void {
  }

}
