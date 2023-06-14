import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { Subscription, timer } from 'rxjs';
import { environment } from "src/environments/environment";



@Component({
    templateUrl: './checkout.html',
    styleUrls: ['./checkout.css']

})




export class CheckoutComponent implements OnInit {
    address_list:any=[];
    cart_list:any=[];
    cartDetails:any={};
    cart_length:number=0;
    wallet:any;
    cart_loaded:boolean=false;
    cart_count:string="";
    coupon_code:string="";
    coupon_applied:boolean=false;
    load:boolean=false;
    LANG:any;
    subscriptions:Subscription[]=[];
    route_path:string="";
    width:string="0";
    half_width:boolean=false;
    full_width:boolean=false;
    reciever_details_error:boolean=false;
    grand_total:string="0";
    constructor(route: ActivatedRoute,private router: Router,private cartService:CartService,private toast:ToastrManager,private shared:SharedService) {
        this.subscriptions.push(this.shared.currentDetailsStatus.subscribe((data:any)=>this.reciever_details_error=data));            
        this.subscriptions.push(this.shared.currentCartList.subscribe((data:any)=>this.cart_list=data));            
        this.subscriptions.push(this.shared.walletUsed.subscribe((data:any)=>{
            if(data){
                if(+this.cartDetails.grand_total >= +this.cartDetails.available_wallet){
                    this.cartDetails.grand_total=(+this.cartDetails.grand_total - +this.cartDetails.available_wallet).toString();
                }else{
                    this.cartDetails.grand_total="0";
                    this.shared.emitShowPayment(false);
                }
            }else{
                if(+this.cartDetails.grand_total >= +this.cartDetails.available_wallet){
                    this.cartDetails.grand_total=(+this.cartDetails.grand_total + +this.cartDetails.available_wallet).toString();
                }else{
                    this.cartDetails.grand_total=this.grand_total;
                    this.shared.emitShowPayment(true);
                }
            }
        }));            
        
        this.subscriptions.push(this.shared.countryChanged.subscribe((country_id:string) => {
            this.getCart();
        })) 
        this.subscriptions.push(this.shared.addons_added.subscribe((status:boolean) => {
            if(status){
                this.getCart();
            }
        })) 
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getCart();
        }))
        this.subscriptions.push(this.shared.currentAddressList.subscribe((data:any) =>this.address_list=data));                
        this.subscriptions.push(this.shared.currentWalletAmount.subscribe((wallet:any) =>this.wallet=wallet));                
        route.url.subscribe(() => {
            this.route_path=route.firstChild!.routeConfig!.path || "";
            if(this.route_path == "address" || this.route_path == "add-address"){
                const time=timer(100);
                this.width="50";
                this.subscriptions.push(time.subscribe(()=>{
                    this.half_width=true;
                }))
                return
            }
            if(this.route_path == "payment"){
                this.width="100";
                this.full_width=true;

            }
         });
      }

    ngOnInit(){
        this.getCart();
        this.changeLanguage();
    }

    
    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }



    checkoutNavigations(){
        if(this.route_path == ""){
            this.router.navigate(['/checkout/address'])
            return
        }
        // if(this.address_list.length == 0){
        //     this.toast.warningToastr("Please add delivery address to proceed forward.","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
        //     return 
        // }
        // const selected_address:[]=this.address_list.filter((data:any)=>{
        //     return data.address_type == "1"
        // })
        // if(selected_address.length == 0){
        //     this.toast.warningToastr("Please Select delivery address.","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
        //     return 
        // }
        const reciever_number=btoa(btoa("reciever_number"))
        if(!localStorage.getItem(reciever_number)){
            const data={
                "mobile_number":true
            }
            this.shared.changeReceiverDetailStatus(data)
            return
        }
        const mobile_number=atob(atob(localStorage.getItem(reciever_number) || ""));
        var re1 = new RegExp(/^([0]{1}[5]{1}[0-9]{8})$/);
        var re2 = new RegExp(/^([5]{1}[0-9]{8})$/);
        var re3 = new RegExp(/^([0]{2}[5]{1}[0-9]{8})$/);
        var re4 = new RegExp(/^([6-9]{1}[0-9]{9})$/);
        var re5 = new RegExp(/^([9]{1}[6]{2}[0-9]{9,})$/);
        var finalRe = new RegExp(re1.source + "|" + re2.source + "|" + re3.source + "|" + re4.source + "|" + re5.source);
        if(!finalRe.test(mobile_number)){
            const data={
                "mobile_number_valid":true
            }
            this.shared.changeReceiverDetailStatus(data)
            return  
        }
        // if(mobile_number && (mobile_number.length < 9 || mobile_number.length > 10)){
        //     const data={
        //         "mobile_number_valid":true
        //     }
        //     this.shared.changeReceiverDetailStatus(data)
        //     return
        // }
        this.shared.changeReceiverDetailStatus({
            "mobile_number_valid":false,
            "mobile_number":false
        })
        
        const order_day=btoa(btoa("order_day"))
        // if(!localStorage.getItem(order_day)){
        //     this.toast.warningToastr("Please Select delivery day.","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
        //     return
        // }
        const order_time=btoa(btoa("order_time"))
        // if(!localStorage.getItem(order_time)){
        //     this.toast.warningToastr("Please Select delivery time.","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
        //     return
        // }
        this.router.navigate(['/checkout/payment'])
        return
        
        
    }


    

    getCart(){ 
        this.subscriptions.push(this.cartService.getCartDetails().subscribe((result:any)=>{
            if(result.response.cart_count==0){
                this.router.navigate(['/'])
            }
            if(result.response.id != ''){
              
                this.cartDetails=result.response;
                this.cart_length=result.response.cart_Detail.length;
                this.setCoupon(this.cartDetails.coupon_code);
                this.cart_loaded=true;
                this.grand_total=this.cartDetails.grand_total;
                this.shared.changeCount(result.response.cart_count);
                this.shared.changeWalletAmount({amount:result.response.available_wallet,currency:result.response.currency});
                this.shared.changeCartList(result.response.cart_Detail)
                return
            }
            this.cartDetails={}
            this.cart_length=0
            this.cart_loaded=true;
            this.shared.changeCount(result.response.cart_count)
        }))
    }


    incrementQuantity(data:any){ 
        data.load=true;
        const new_quantity=(parseInt(data.quantity)+1).toString()
        const post_data={
            "cart_detail_id":data.id,
            "quantity":new_quantity
        } 
        this.updateCart(post_data)
    }

    decrementQuantity(data:any){ 
        if(parseInt(data.quantity) == 1){
            return
        }
        data.load=true;
        const new_quantity=(parseInt(data.quantity)-1).toString()
        const post_data={
            "cart_detail_id":data.id,
            "quantity":new_quantity
        } 
        this.updateCart(post_data)
    }
    
    removeCart(data:any){
        const post_data={
            "cart_detail_id":data.id,
            "quantity":"0"
        }
        this.updateCart(post_data,1)
    }
 
    updateCart(data:any,type?:number){
        this.subscriptions.push(this.cartService.updateCart(data).subscribe((result:any)=>{
            if(result.response.id != ''){
                this.cartDetails=result.response;
                this.cart_length=result.response.cart_Detail.length;
                if(type == 1){
                    const new_count=(parseInt(this.cart_count) - 1).toString();
                    this.shared.changeCount(new_count);
                    this.shared.changeCartList(result.response.cart_Detail)
                    return
                }
                return
            }
            this.cartDetails={};
            this.shared.changeCount("0");
            this.cart_length=0;
            this.router.navigate(['/']);
        }))

    }


    applyCoupon(){
        if(this.coupon_code == "" || this.coupon_code == undefined){
            this.toast.warningToastr("Please Enter Coupon Code","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
            return
        }
        this.load=true;
        const data={
            "coupon_code":this.coupon_code
        }
        this.couponCode(data);
    }


    removeCoupon(){
        const data={
            "coupon_code":""
        }
        this.load=true;
        this.couponCode(data);
    }


    couponCode(data:any){
        this.subscriptions.push(this.cartService.applyCoupon(data).subscribe((result:any)=>{
        this.load=false;
            if(result.response.id && result.response.id != ''){
                this.cartDetails=result.response;
                this.cart_length=result.response.cart_Detail.length;
                this.setCoupon(this.cartDetails.coupon_code);
                this.cart_loaded=true;
                return
            }
            this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'})
        }))
    }
    
    setCoupon(coupon_code:string){
        if(coupon_code != ''){
            this.coupon_code=coupon_code;
            this.coupon_applied=true;
            return
        }
        this.coupon_code=""
        this.coupon_applied=false;
    }

    goToproductDetails(product:any){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product.product_id))}})
    }
   

      



} 