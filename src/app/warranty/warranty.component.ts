import { Component, OnInit } from '@angular/core';
import { WarrantyService } from '../SharedResources/Services/warranty.service';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css']
})
export class WarrantyComponent implements OnInit {

  constructor(public warantyservice:WarrantyService) { }

  ngOnInit(): void {
    this.productlist();
  }


  productlistdata:any
  productlist(){
    this.warantyservice.productlist().subscribe((res:any) =>{
      this.productlistdata=res.response
    })
  }


}
