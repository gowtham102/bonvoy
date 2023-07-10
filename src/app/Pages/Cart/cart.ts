import { Component,Inject,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { DOCUMENT } from '@angular/common';
import { LoginService } from 'src/app/SharedResources/Services/login.service';
declare const $: any;




@Component({
    templateUrl: './cart.html',
    styleUrls: ['./cart.css'],
})




export class CartComponent implements OnInit {
    cartDetails:any={};
    cart_length:number=0;
    cart_loaded:boolean=false;
    cart_count:string="";
    coupon_code:string="";
    coupon_applied:boolean=false;
    load:boolean=false;
    LANG:any;
    subscriptions:Subscription[]=[];
    addon_categories:any=[];
    addon_list:any=[];
    addon_id:string="";
    addon_category_id:string="";
    logged_in:boolean=true
    notes:any
    country_list:any

    constructor(@Inject(DOCUMENT) private document: Document,private cartService:CartService,private toast:ToastrManager,private shared:SharedService,private router:Router, public loginService:LoginService){
        this.subscriptions.push(this.shared.currentUserStatus.subscribe(user=>this.logged_in=user));
        this.subscriptions.push(this.shared.currentCountryList.subscribe((data:any) =>this.country_list=data));
        this.subscriptions.push(this.shared.countryChanged.subscribe((country_id:string) => {
            this.getCart();
        })) 
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getCart();
            this.getAddOnList();
        }))
    }


    ngOnInit(){
        this.getCart();
        this.changeLanguage();
        // this.getAddOnList();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    getCart(){ 
        this.subscriptions.push(this.cartService.getCartDetails().subscribe((result:any)=>{
            if(result.response.id != ''){
                this.cartDetails=result.response;
                this.cart_length=result.response.cart_Detail.length;
                this.setCoupon(this.cartDetails.coupon_code);
                this.cart_loaded=true;
                this.cart_count=result.response.cart_count;
                this.shared.changeCount(result.response.cart_count);
                this.cartDetails.cart_Detail.map((item:any)=>{
                    item.display_from_date=this.formatDate(item.delivery_from);
                    item.display_to_date=this.formatDate(item.delivery_to);
                })
                return
            }
            this.cartDetails={}
            this.cart_length=0
            this.cart_loaded=true;
            this.cart_count=result.response.cart_count;
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
                    this.shared.changeCount(new_count)
                    return
                }
                return
            }
            this.cartDetails={};
            this.shared.changeCount("0");
            this.cart_length=0;
        }))

    }


    applyCoupon(){
        if(this.coupon_code == "" || this.coupon_code == undefined){
            this.toast.warningToastr(this.LANG.Please_Enter_Coupon_Code,"",{position:'top-right',toastTimeoout:3000,maxShown:1,newestOnTop:false,animate:'null'});
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

    addToWishlist(data:any){
        if(data.wishlist == "1"){
            this.removeCart(data);
            this.toast.warningToastr(this.LANG.Product_already_in_wishlist,"",{position:"top-right",toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'})
            return
        }
        this.subscriptions.push(this.cartService.addWishlist(data.product_id).subscribe((result:any)=>{
            if(result.status){
              if(result.response.status){
                data.wishlist="1";
                this.removeCart(data);
                this.toast.successToastr(this.LANG.Product_added_to_wishlist,"",{position:"top-right",toastTimeout:3000});
                return
              }
            }
              this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000}) 
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

    ngOnDestroy(): void {
        this.subscriptions.map(s => s.unsubscribe());
    }

    formatDate(value:any){
        if(value == ""){
          return
        }
        // const date=value.split(" ")[0]
        // const day=date.split("-")[2]
        // const month=date.split("-")[1]
        // const year=date.split("-")[0]
        // return `${this.getMonth(month)} ${day},${year}`
      }
    
      getMonth(index:number){
          const months = ["January","February","March","April","May",
          "June","July","August", "September","October","November","December"];
          return months[index-1]
      }


      
    getAddOnList(){
        this.subscriptions.push(this.cartService.getAddOnList().subscribe((result:any)=>{
            if(result.status){
                this.addon_categories=result.response;
                if(this.addon_categories.category.length > 0){
                    this.addon_list=this.addon_categories.category[0].ad_ons;
                    this.addon_category_id=this.addon_categories.category[0].id;
                }
                return
            }
        }))
    }

    changeAddonsCategoy(data:any){
        if(data.id == this.addon_category_id){
            return
        }
        this.addon_list=data.ad_ons;
        this.addon_category_id=data.id;
    }

    selectAddons(item:any){
        item.load=true;
        const data={
            "product_id":item.id,
            "quantity":"1"
        }
        this.subscriptions.push(this.cartService.addCart(data).subscribe((result:any)=>{
            if(result.status){
                item.active=true;
                this.addon_id=item.id;
                item.load=false;
                // this.shared.emitAddons(true);
                this.getCart();
                return
            }
            item.load=false;
        }))
    }

    guestLogin:any
    checkout(){
        localStorage.setItem('notes',this.notes)
        const data = 'login-modal'
       this.guestLogin= localStorage.getItem("guest_login")
       if(this.guestLogin=="true"){
        this.openmodal()

        
        return
       }
       this.router.navigate(['/checkout/address']);

       

    }
   
    guest_number:any
    guest_code:any
    otp1:any
    otp2:any
    otp3:any
    otp4:any
    otp5:any
    otp6:any
    show_otp:boolean= false
    token:any


    changeCountryCode(){
        console.log(this.guest_code);
        
        // this.login_error.mobile_number_valid=false;
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
        var pastedData = clipboardData.getData('Text');
        if (isNaN(pastedData)) {
            e.preventDefault();
        } else {
            return;
        }
        }
        var x = e.which || e.keycode;
        if ((x >= 48 && x <= 57))
            return true;
        else
            return false;
      } 

      getOtpReference(id:any){
        return this.document.getElementById(id) as HTMLInputElement
      }
      
      getCodeBoxElement(index:number) {
        if(index===1){
          return this.getOtpReference("codeBox1")
        }
        if(index===2){
          return this.getOtpReference("codeBox2")
        }
        if(index===3){
          return this.getOtpReference("codeBox3")
        }
        if(index===4){
          return this.getOtpReference("codeBox4")
        }
        if(index===5){
          return this.getOtpReference("codeBox5")
        }
        if(index===6){
          return this.getOtpReference("codeBox6")
        }
        return
      }
       onKeyUpEvent(index:number, event:any) {
        const eventCode = event.which || event.keyCode;
        const id=`codeBox${index}`
        if (this.getOtpReference(id)!.value.length === 1) {
          if (index !== 6) {
            const next_id=`codeBox${index+1}`
            this.getOtpReference(next_id)!.focus();
          } else {
            if(index == 6){
              return
            }
            this.getOtpReference(id)!.blur();
          }
        }
        if(eventCode === 8 && index !== 1) {
          const prev_id=`codeBox${index-1}`
          this.getOtpReference(prev_id).focus();
        }
      }
      
      onFocusEvent(index:number) {
        for (let item = 1; item < index; item++) {
          const id=`codeBox${item}`
          const currentElement = this.getOtpReference(id);
          if (currentElement) {
              currentElement.focus();
              break;
          }
        }
      }
      
      keyPressed(event:any,index:number){
        let keycode = (event.which) ? event.which : event.keyCode;
        if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
            event.preventDefault();
            return false;
        } 
        if(this.getOtpReference('codeBox1').value.length===1 && index==1) {
          return false;
        }
        if(this.getOtpReference('codeBox2').value.length===1 && index==2) {
          return false;
        }
        if(this.getOtpReference('codeBox3').value.length===1 && index==3) {
          return false;
        }
        if(this.getOtpReference('codeBox4').value.length===1 && index==4) {
          return false;
        }
        if(this.getOtpReference('codeBox5').value.length===1 && index==5) {
          return false;
        }
        if(this.getOtpReference('codeBox6').value.length===1 && index==6) {
          return false;
        }
        return
      }
      
      
    sendOTP(){

        let data = {
            country_code: this.guest_code,
            mobile_number: this.guest_number
        }
        this.loginService.sendOtp(data).subscribe((res:any)=>{
            if(res.status==true){
                this.toast.successToastr("OTP Has Sent to registre Mobile Number")
                this.show_otp= true
                
            }
        })
    }

    checkmobile(){
        let data={"mobile_number":this.guest_number,"country_code":this.guest_code}

        this.loginService.checkMobile(data).subscribe((res:any)=>{
            if(res.status==true){
                this.loginUser()
            }
            if(res.status==false){
                this.registerUser()
            }
        })

    }

    loginUser(){
        this.token=localStorage.getItem('token')
        const otp=this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6;
        const data={
          "mobile_number": this.guest_number,      
          "country_code": this.guest_code,
          "otp": otp, 
          "token":this.token

        }
        this.loginService.userLogin(data).subscribe((res:any)=>{
            if(res.status==true){
                this.toast.successToastr(res.response.message)
                localStorage.setItem('token',res.response.token)
                localStorage.setItem("logged_in", btoa("1"));

                this.router.navigate(['/checkout/address']);

            }
            else{
                this.toast.warningToastr(res.response.message)
            }
        })
    }

    registerUser(){
        this.token=localStorage.getItem('token')
        const otp=this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6;
        const data={
          "mobile_number": this.guest_number,      
          "country_code": this.guest_code,
          "otp": otp, 
          "token":this.token

        }
        this.loginService.register(data).subscribe((res:any)=>{
            if(res.status==true){
                this.toast.successToastr(res.response.message)
                localStorage.setItem('token',res.response.token)
                localStorage.setItem("logged_in", btoa("1"));

                this.router.navigate(['/checkout/address']);
            }
            else{
                this.toast.warningToastr(res.response.message)
            }
        })
    }

    verifyOtp(){
        const otp = this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6
        let data = {
            "mobile_number": this.guest_number,
            "country_code": this.guest_code,
            "otp": otp

        }

        this.loginService.verifyOtp(data).subscribe((res:any)=>{
            if(res.status==true){
                this.toast.successToastr("Successfully Logedin")
                this.checkmobile()
                
            }

            if(res.status==false){
                this.toast.warningToastr("Please Enter Proper OTP")

            }
            
        })
    }


    openmodal(){
        $("#loginModal").addClass("show");
      }
      



} 