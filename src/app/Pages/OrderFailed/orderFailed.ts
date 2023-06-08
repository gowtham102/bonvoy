import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Params, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';



@Component({
    templateUrl: './orderFailed.html',
    styleUrls: ['./orderFailed.css']

})




export class OrderFailedComponent implements OnInit {

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
    }


    ngOnInit(){
      this.changeLanguage();
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
        this.message=`${this.LANG.Your_payment_for_order_ID} ${this.order_id} ${this.LANG.was_failed}`;
        return
      }
      this.message=`${this.LANG.Your_payment_was_failed}`;
    }
    
   

      



} 