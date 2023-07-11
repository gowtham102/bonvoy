import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../SharedResources/Services/shared.service';

@Component({
  selector: 'app-ewaste',
  templateUrl: './ewaste.component.html',
  styleUrls: ['./ewaste.component.css']
})
export class EwasteComponent implements OnInit {

  constructor(private shared:SharedService) { }
  subscriptions:Subscription[]=[];
    footer_data:any=[];

  ngOnInit(): void {
    this.subscriptions.push(this.shared.currentFooterData.subscribe((data:any) => {
      this.footer_data=data.utility;
  }))
  }

}
