import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { ProfileService } from 'src/app/SharedResources/Services/profile.service';
import { order_data } from 'src/app/SharedResources/Models/order.model';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
    selector: 'app-payment',
    templateUrl: './payment.html',
    styleUrls: ['./payment.css'] 

})




export class PaymentComponent implements OnInit {
    load:boolean=false;
    cart_design_id:string="";
    delivery_address_id:string="";
    to_text:string="";
    from_text:string="";
    message:string="";
    reciever_number:string="";
    reciever_address:string="";
    order_day:string="";
    order_time:string="";
    to_time:string="";
    default_address:any={};
    wallet:any;
    type:number=1;
    payment_type:number=2;
    payment_mode:number=1;
    subscriptions:Subscription[]=[]
    LANG:any;
    terms:boolean=false;
    use_wallet:boolean=false;
    show_payment:boolean=true;
    notes:any


    constructor(private shared:SharedService,private profileService:ProfileService,private modalService: NgbModal,private orderService:OrderService,private toast:ToastrManager,private router:Router){
        
        this.notes= localStorage.getItem('notes')
        this.subscriptions.push(this.shared.currentWalletAmount.subscribe((wallet:any)=>this.wallet=wallet));                
        this.subscriptions.push(this.shared.show_payment.subscribe((status:boolean)=>this.show_payment=status));                
        const cart_design=btoa(btoa("card_design"));
        if(localStorage.getItem(cart_design)){
            this.cart_design_id=atob(atob(localStorage.getItem(cart_design) || ""));
        }
        const delivery_address_id=btoa(btoa("delivery_address_id"));
        if(localStorage.getItem(delivery_address_id)){
            this.delivery_address_id=atob(atob(localStorage.getItem(delivery_address_id) || ""));
        }
        const order_day=btoa(btoa("order_day"))
        if(localStorage.getItem(order_day)){
            this.order_day=atob(atob(localStorage.getItem(order_day) || ""));
        }
        const order_time=btoa(btoa("order_time"))
        if(localStorage.getItem(order_time)){
            this.order_time=atob(atob(localStorage.getItem(order_time) || ""));
        }
        const to_time=btoa(btoa("to_time"))
        if(localStorage.getItem(to_time)){
            this.to_time=atob(atob(localStorage.getItem(to_time) || ""));
        }
        const to_text=btoa(btoa("to_text"))
        if(localStorage.getItem(to_text)){
            this.to_text=decodeURIComponent(escape(atob(atob(localStorage.getItem(to_text) || ""))));
        }
        const from_text=btoa(btoa("from_text"))
        if(localStorage.getItem(from_text)){
            this.from_text=decodeURIComponent(escape(atob(atob(localStorage.getItem(from_text) || ""))));
        }
        const message=btoa(btoa("post_message"))
        if(localStorage.getItem(message)){
            this.message=decodeURIComponent(escape(atob(atob(localStorage.getItem(message) || ""))));
        }
        console.log(this.message)
        const reciever_number=btoa(btoa("reciever_number"))
        if(localStorage.getItem(reciever_number)){
            this.reciever_number=atob(atob(localStorage.getItem(reciever_number) || ""));
        }
        const reciever_address=btoa(btoa("reciever_address"))
        if(localStorage.getItem(reciever_address)){
            this.reciever_address=decodeURIComponent(escape(atob(atob(localStorage.getItem(reciever_address) || ""))));
        }

        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
        }))
    }


    ngOnInit(){
        // this.getDefaultAddress();
        this.changeLanguage();
        this.delivery_address_id=atob(atob(localStorage.getItem("delivery_address_id") || ""));
        console.log(this.delivery_address_id);
        
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    getDefaultAddress(){
        this.subscriptions.push(this.profileService.getAddressList(this.type).subscribe((result:any)=>{
            if(result.status){
                this.default_address=result.response[0];
            }
        }))
    }

    changePaymentType(payment_type:number,payment_mode?:number){
        if(payment_mode){
            this.payment_mode=payment_mode;
        }
        if(payment_type == this.payment_type){
            return
        }
        this.payment_type=payment_type
    }

    submitOrder(){
        if(!this.terms){
            this.toast.warningToastr(this.LANG.Please_accept_terms_and_conditions,"",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
            return
        }
        if(this.delivery_address_id== ""){
            this.toast.warningToastr("Please Select the Address","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
            return
        }
        this.load=true;
        const data:order_data={
            "address_id":this.delivery_address_id,
            "payment_type":this.payment_type.toString(),
            "payment_mode":this.payment_mode.toString(),
            "order_from":"1",
            "wallet":this.use_wallet ? "1":"0",
            "date":this.order_day,
            "time":this.order_time,
            "to_time":this.to_time,
            "card_id":this.cart_design_id,
            "card_to":this.to_text,
            "card_from":this.from_text,
            "card_message":this.message,
            "recievers_number":this.reciever_number,
            "recievers_address":this.reciever_address,
            "notes":this.notes
        }
        this.orderService.orderSubmit(data).subscribe((result:any)=>{
          this.load=false
          if(result.response.status){
              this.clearLocalData();
            if(result.response.url){
                location.href=result.response.url;
                return
            }
            this.toast.successToastr(this.LANG.Order_Placed_successfully,"",{position:'top-right',toastTimeout:3000});
            this.shared.changeCount("0");
            this.router.navigate(['/order-success'])
            return
          }
          this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000})
      })
    }
    
    openTerms(modalContent:any) {
        this.modalService.open(modalContent,{ centered: true });
    }

    useWallet(){
        this.shared.emitWalletUsed(this.use_wallet)
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
   

      



} 