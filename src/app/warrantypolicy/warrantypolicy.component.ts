import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '../SharedResources/Services/shared.service';

@Component({
  selector: 'app-warrantypolicy',
  templateUrl: './warrantypolicy.component.html',
  styleUrls: ['./warrantypolicy.component.css']
})
export class WarrantypolicyComponent implements OnInit {

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
