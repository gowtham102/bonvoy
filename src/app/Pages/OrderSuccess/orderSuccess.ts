import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Params, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';



@Component({
    templateUrl: './orderSuccess.html',
    styleUrls: ['./orderSuccess.css']

})




export class OrderSuccessComponent implements OnInit {

    subscriptions:Subscription[]=[];
    order_id:string="";
    message:string="";
    LANG:any;

    constructor(private route:ActivatedRoute,private shared:SharedService){
        this.subscriptions.push(this.route.queryParams
            .subscribe(
              (params: Params) => {
                if(params['id']){
                  this.order_id = atob(params['id']);
                }
              }
        ))
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
          this.changeLanguage();
        }))
        this.clearLocalData();
    }


    ngOnInit(){
      this.changeLanguage();
    }

    clearLocalData(){
      const order_day=btoa(btoa("order_day"))
      if(localStorage.getItem(order_day)){
          localStorage.removeItem(order_day);
      }
      const order_time=btoa(btoa("order_time"))
      if(localStorage.getItem(order_time)){
          localStorage.removeItem(order_time);
      }
      const to_time=btoa(btoa("to_time"))
      if(localStorage.getItem(to_time)){
          localStorage.removeItem(to_time);
      }
      const to_text=btoa(btoa("to_text"))
      if(localStorage.getItem(to_text)){
          localStorage.removeItem(to_text);
      }
      const from_text=btoa(btoa("from_text"))
      if(localStorage.getItem(from_text)){
          localStorage.removeItem(from_text);
      }
      const message=btoa(btoa("message"))
      if(localStorage.getItem(message)){
          localStorage.removeItem(message);
      }
      const reciever_number=btoa(btoa("reciever_number"))
      if(localStorage.getItem(reciever_number)){
          localStorage.removeItem(reciever_number);
      }
      const reciever_address=btoa(btoa("reciever_address"))
      if(localStorage.getItem(reciever_address)){
          localStorage.removeItem(reciever_address);
      }
      const delivery_address_id=btoa(btoa("delivery_address_id"))
      if(localStorage.getItem(delivery_address_id)){
          localStorage.removeItem(delivery_address_id);
      }
    }

    changeLanguage(){
      if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        // this.LANG=environment.arabic_translations;
        this.setMessage(this.order_id);
        return
      }
      this.LANG=environment.english_translations;
      this.setMessage(this.order_id);
    }

    setMessage(id?:string){
      if(id){
        this.message=`${this.LANG.Your_payment_for_order_ID} ${this.order_id} ${this.LANG.was_successfull}`;
        return
      }
      this.message=`${this.LANG.Your_order_has_been_placed}`;
    }
    
   

      



} 