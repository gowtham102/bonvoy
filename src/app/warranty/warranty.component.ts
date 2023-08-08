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

  product_id:any=""
  distrubuter_id:any=""
  serial_number:any=""
  order_number:any=""
  email_id:any=""
  mobile_number:any=""
  full_name:any=""
  country_code:any="+91"
  err:boolean= false
  address_error:any={};
  warrantyClaim(){
    this.err= false
    this.errorhandle()
    if(this.err)return;

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


  

  errorhandle(){
    if(this.product_id==""){
      this.err= true
      this.address_error.product_id= true
    }
    if(this.distrubuter_id==""){
      this.err= true
      this.address_error.distrubuter_id= true
    }
    if(this.serial_number==""){
      this.err= true
      this.address_error.serial_number= true
    }
    if(this.order_number==""){
      this.err= true
      this.address_error.order_number= true
    }
    if(this.email_id== ""){
      this.err=true
      this.address_error.email_id= true
    }
    if(this.mobile_number==""){
      this.err= true
      this.address_error.mobile_number= true
    }
    if(this.full_name==""){
      this.err = true
      this.address_error.full_name= true
    }

  }


  onlyNumbers(event:any){
    var keycode = (event.which) ? event.which : event.keyCode;
    if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
       event.preventDefault();
       return false;
    } 
    return   
  }

restrictAlphabets(e:any) {
    if (e.type == "paste") {
    var clipboardData = e.clipboardData;
    const mobile_number=clipboardData.getData('Text').split("+").join("").split(" ").join("");
    if (isNaN(mobile_number)) {
        e.preventDefault();
    } else {
        e.clipboardData.setData('text/plain', mobile_number);
        e.preventDefault();
        this.mobile_number=mobile_number.substring(0,13);
        // this.inputChange(5);
        return;
    }
    }
  }


}
