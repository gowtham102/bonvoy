import { Component, OnInit } from '@angular/core';
import { WarrantyService } from '../SharedResources/Services/warranty.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';


@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css']
})
export class WarrantyComponent implements OnInit {

  constructor(public warantyservice:WarrantyService,  public toast:ToastrManager, public router:Router) { }

  ngOnInit(): void {
    this.productlist();
    this.distrubuterList()
  }


  productlistdata:any
  distrubuterListData:any
  productlist(){
    this.warantyservice.productlist().subscribe((res:any) =>{
      this.productlistdata=res.response
    })
  }

  distrubuterList(){
    this.warantyservice.distrubuterList().subscribe((res:any)=>{
      this.distrubuterListData = res.response
    })
  }

  productChange(){}
  distrubutorChange(){}
  countrycodeChange(){}

  product_id:any
  distrubuter_id:any
  serial_number:any
  order_number:any
  email_id:any
  mobile_number:any
  full_name:any
  country_code:any
  warrantyClaim(){

    const con_mobile= this.country_code +this.mobile_number
    let data = {
                "product_id":this.product_id,"distrubuter_id":this.distrubuter_id,"serial_number":this.serial_number,"order_number":this.order_number,
                 "email_id":this.email_id,"mobile_number":con_mobile,"full_name":this.full_name
              }

    this.warantyservice.warrantyClaim(data).subscribe((res:any)=>{
      if(res.status){
        this.toast.successToastr("Your Warranty has been Claimed")
        this.router.navigate([''])
        
      }
      if(res.status==false){
        this.toast.warningToastr(res.message)
      }
    })
    
  }


}
