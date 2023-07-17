import { Component,Inject,OnInit,Renderer2 } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/SharedResources/Services/product.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";
import { LoginService } from 'src/app/SharedResources/Services/login.service';
import { DOCUMENT } from '@angular/common';
declare const $: any;

declare const TabbyPromo:any;

@Component({
    templateUrl: './productDetails.html',
    styleUrls: ['./productDetails.css']

})




export class ProductDetailsComponent implements OnInit {
    fade_in:boolean=true;
    main_image:string="";
    product_id:string="";
    product_details:any={};
    related_products:any=[];
    load:boolean=false;
    err:boolean=false;
    subscriptions:Subscription[]=[];
    no_product:boolean=false;
    product_loaded:boolean=false;
    logged_in:boolean=false;
    slider_direction_rtl:boolean=false;
    img_error:boolean=false;
    LANG:any;
    tabby_loaded:boolean=false;
    tabby_lang:string="en";
    is_video:string="";
    rating:any
    country_list:any
    bestSeller: OwlOptions = {
        loop: true,
        margin:20,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText:["<img src='assets/images/icons/round-prev.png'/>","<img src='assets/images/icons/round-next.svg'/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        responsive: {
          0: {
            items: 2,
            margin:10,
          },
          400: {
            items: 2,
            margin:10,
  
          },
          740: {
            items: 3,
            margin:20,
          },
          940: {
            items: 4,
            margin:20,
          }
        },
        nav: true
    }


    constructor(@Inject(DOCUMENT) private document: Document,public productService:ProductService,private route:ActivatedRoute,private cartService:CartService,private router:Router,private toast:ToastrManager,private shared:SharedService, public loginService:LoginService,){
      this.subscriptions.push(this.shared.currentUserStatus.subscribe(user=>this.logged_in=user));
      this.subscriptions.push(this.shared.currentCountryList.subscribe((data:any) =>this.country_list=data));

      this.subscriptions.push(this.shared.countryChanged.subscribe((country_id:string) => {
        this.getProductDetails();
      })) 
      this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
        this.changeLanguage();
        this.getProductDetails();
      }))
      this.subscriptions.push(this.route.queryParams
        .subscribe(
          (params: Params) => {
            if(params['product_id']){
              this.product_id = atob(atob(params['product_id']))
              this.getProductDetails();
            }
          }
      ))
      this.subscriptions.push(this.route.params
        .subscribe(
          (params: Params) => { 
            console.log(params)
            if(params['product_id']){
              this.product_id = atob(atob(params['product_id']))
              this.getProductDetails();
            }
          }
      ))
      if(localStorage.getItem('logged_in') != undefined){
        this.logged_in=true;
        this.shared.changeUserStatus(true); 
      }
    }


    ngOnInit(){
      this.onActivate()
      this.changeLanguage();
      // $('.rating').on('click', '.ratings_stars', function() {
        const star = $(".ratings_stars");
        star.addClass('selected');
        star.prevAll().addClass('selected');
        star.nextAll().removeClass('selected');
        $('#rating').val(star.data('rating'));
      // });
    }

    changeLanguage(){
        this.tabby_loaded=false;
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            this.slider_direction_rtl=true;
            this.tabby_lang="ar";
            return
        }
          this.LANG=environment.english_translations;
          this.slider_direction_rtl=false;
          this.tabby_lang="en";
    }
p_variation:any
    getProductDetails(){
      this.subscriptions.push(this.productService.getProductDetails(this.product_id).subscribe((result:any)=>{
          if(result.response.length == 0){
              this.no_product=true;
              this.product_loaded=true;
              return
          }
          this.product_details=result.response;
          this.product_details.quantity="1";
          this.product_details.display_from_date=this.formatDate(this.product_details.delivery_from);
          this.product_details.display_to_date=this.formatDate(this.product_details.delivery_to);
          this.p_variation = this.product_details.product_variation[0].value
          this.addPromoCode()

          this.no_product=false;
          this.product_loaded=true;
          this.getRelatedProducts(result.response.parent_sku)
          if(this.product_details.images.length > 0){
            this.main_image=this.product_details.images[0].image;
            return
          }
          this.main_image="assets/images/icons/logo-grey.svg";
          this.img_error=true;
      }))
  }
    getProductDetails2(event:any){
      this.subscriptions.push(this.productService.getProductDetails(event).subscribe((result:any)=>{

          if(result.response.length == 0){
              this.no_product=true;
              this.product_loaded=true;
              return
          }
          this.onActivate()
          this.product_details=result.response;
          this.product_details.quantity="1";
          this.product_details.display_from_date=this.formatDate(this.product_details.delivery_from);
          this.product_details.display_to_date=this.formatDate(this.product_details.delivery_to);
          this.addPromoCode()

          this.no_product=false;
          this.product_loaded=true;
          this.getRelatedProducts(result.response.parent_sku)
          if(this.product_details.images.length > 0){
            this.main_image=this.product_details.images[0].image;
            return
          }
          this.main_image="assets/images/icons/logo-grey.svg";
          this.img_error=true;
      }))
  }


  onActivate() {
    // window.scroll(0,0);
 
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
 
     //or document.body.scrollTop = 0;
     //or document.querySelector('body').scrollTo(0,0)
 }
  getRelatedProducts(parent_sku:string){
    this.subscriptions.push(this.productService.getRelatedProducts(parent_sku).subscribe((result:any)=>{
      if(result.status){
        this.related_products=result.response;
        this.bestSeller.rtl=this.slider_direction_rtl;
      }
    }))
  }

  changeProductImage(data:any){
    this.fade_in=false;
    this.main_image=data.image;
    this.is_video=data.type
    setTimeout(() => {
      this.fade_in=true;
    }, 100);
  }

  incrementQuantity(){ 
    this.product_details.quantity=(parseInt(this.product_details.quantity)+1).toString()
  }

  decrementQuantity(){ 
    if(parseInt(this.product_details.quantity) == 1){
        return
    }
    this.product_details.quantity=(parseInt(this.product_details.quantity)-1).toString()
  }

  guestLoginUser:any = false
  guestLogin(data?:any,type?:number){
    this.guestLoginUser=  localStorage.getItem('guest_login')
    if(!this.logged_in && this.guestLoginUser!='true'){
      this.guestLoginUser = true

      this.productService.guestLogin().subscribe((res:any)=>{
        localStorage.clear()
        // localStorage.setItem("logged_in", btoa("1"));
        localStorage.setItem("token", res.response.token);   
        localStorage.setItem("guest_login",this.guestLoginUser)
        this.addToCart(data,type)
        this.logged_in= true
        return
      })
        

    }
    else if(this.logged_in || this.guestLoginUser=='true' ){
      this.addToCart(data,type)
    }
  }

  addToCart(data:any,type?:number){
    this.token= localStorage.getItem('token')
    if(data.stock == "2"){
      return
    }
    
    const post_data={
        "product_id": data.id,
        "quantity":"1",
        "token":this.token
    }
    if(type == 2){
      this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
        this.load=false;
        if(result.status){
            this.shared.changeCount(result.response.extra);
            data.load=false;
            this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});

            
            return
        }
        this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
    }))
    }else{
      data.load=true;
    }
    if(type==1){this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
      this.load=false;
      if(result.status){
          this.shared.changeCount(result.response.extra);
          data.load=false;
          this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});
          this.router.navigate(['/my-cart']);

          if(type == 1){
            setTimeout(() => {
                this.router.navigate(['/my-cart']);
            }, 100);
          }
          return
      }
      this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
  }))}
    
  }
  BuyNow(data?:any,type?:number){
    
    if(data!=undefined){
      localStorage.setItem('data',data.id)
    }
    
    if(!this.logged_in){
      this.openmodal()
      return
    }
    if(data!=undefined){
      
      const post_data={
        "product_id": data.id,
        "quantity":"1"
    }
    
    this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
      const typee=2
        this.load=false;
        if(result.status){
            this.shared.changeCount(result.response.extra);
            // data.load=false;
            
            this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});
           
            if(type == 2){
              setTimeout(() => {
                this.router.navigate(['/checkout/address']);
              }, 100);
            }
            return
        }
        this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
    }))
    }

    if(data==undefined){
      data= localStorage.getItem('data')
      const post_data={
        "product_id": data,
        "quantity":"1"
    }
    
    this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
      const typee=2
        this.load=false;
        if(result.status){
            this.shared.changeCount(result.response.extra);
            // data.load=false;
          
            this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});
            
            if(typee == 2){
              setTimeout(() => {
                this.router.navigate(['/checkout/address']);
              }, 100);
            }
            return
        }
        this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
    }))
    }
    
   
    // if(data.stock == "2"){
    //   return
    // }
    // if(!this.logged_in){
    //   this.shared.emitModalOpen({id:data.id,type:2})
    //   return
    // }
   
  }

  addToWishlist(data:any){
    if(!this.logged_in){
        this.shared.emitModalOpen({id:data.id,type:1,wishlist:data.wishlist})
        return
    }
    this.subscriptions.push(this.cartService.addWishlist(data.id).subscribe((result:any)=>{
        if(result.status){
          if(result.response.status){
            data.wishlist="1";
            this.toast.successToastr(this.LANG.Product_added_to_wishlist,"",{position:"top-right",toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
            return
          }
          data.wishlist="0";
          this.toast.successToastr(this.LANG.Product_removed_from_wishlist,"",{position:"top-right",toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'})
          return
        }
          this.toast.warningToastr(result.reponse.message,"",{position:"top-right",toastTimeout:3000}) 
    }))
  }

    
  goToproductList(){
    this.router.navigate(['/products'],{ queryParams: { category_id: btoa(btoa(this.product_details.category_id))}});
  }

  goToProductDetails(product_id:string){
    this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product_id))}})
  }

  formatDate(value:any){
    if(value == ""){
      return
    }
    const date=value?.split(" ")[0]
    const day=date?.split("-")[2]
    const month=date?.split("-")[1]
    const year=date?.split("-")[0]
    return `${this.getMonth(month)} ${day},${year}`
  }

  getMonth(index:number){
      const months = ["January","February","March","April","May",
      "June","July","August", "September","October","November","December"];
      return months[index-1]
  }

  addPromoCode(){
    const api_key="pk_8a7f2753-ffe3-4c87-8dbd-7a76848c8d6b";
    new TabbyPromo({
      selector: '#TabbyPromo',
      currency: this.product_details.currency,
      price: this.product_details.price,
      installmentsCount: 4,
      lang: this.tabby_lang,
      source: 'product',
      api_key: api_key
    });
    this.tabby_loaded=true;
  }
  review:any
  insertRating(){
    if(this.rating!=0){
      let data=  {"order_detail_id":this.product_id,"rating":this.rating,"comment":this.review}
      this.productService.insert_review(data).subscribe((res:any)=>{
        if(res.status==true){
          this.toast.successToastr(res.response.message)
        }
        if(res.status==false){
          this.toast.warningToastr(res.response.message)
        }
      })
    }
  

  
  }

  

  guestLoginb:any
  checkout(dataa:any,type?:number){
      // localStorage.setItem('notes',this.notes)
      const data = 'login-modal'
     this.guestLoginb= localStorage.getItem("token")
     if(!this.logged_in){
      this.openmodal()
      this.guestLogin()
      

      
      return
     }
    this.BuyNow(dataa,type)
     

  }

  guest_number:any
  guest_code:any="+91"
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
      this.token=localStorage.getItem('guest_token')
      const otp=this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6;
      const data={
        "mobile_number": this.guest_number,      
        "country_code": this.guest_code,
        "otp": otp, 
        "token":this.token

      }
      this.loginService.userLogin(data).subscribe((res:any)=>{
          if(res.status==true){
            // this.closemodal()
            localStorage.setItem('token',res.response.token)
            this.token = res.response.token
            this.logged_in= true
            localStorage.setItem("guest_login","")
                localStorage.setItem(btoa(btoa(("user_info"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(res.response))))));
                this.shared.changeUserStatus(true);
                this.shared.changeUserData(res.response);
                const user_profile={user_name:res.response.full_name,profile_image:res.response.profile_image  || "assets/images/icons/user-round.svg"}
                this.shared.changeUserProfile(user_profile);
              this.BuyNow()
              // this.toast.successToastr(res.response.message)
              
              localStorage.setItem("logged_in", btoa("1"));
              
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
              localStorage.setItem("guest_login","")
                localStorage.setItem(btoa(btoa(("user_info"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(res.response))))));
                this.shared.changeUserStatus(true);
                this.shared.changeUserData(res.response);
                const user_profile={user_name:res.response.full_name,profile_image:res.response.profile_image  || "assets/images/icons/user-round.svg"}
                this.shared.changeUserProfile(user_profile);
              this.logged_in=true
              // this.closemodal()
              this.BuyNow()
              // this.router.navigate(['/checkout']);
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
      $("#loginModal,.overlay-pop").toggleClass("show");
    }
  
//   first(){
    
//   const errorField = this.renderer.selectRootElement('faq');
//     errorField.scrollIntoView();
// }
targetElement: any;

scrollToElement() {
  this.targetElement = document.getElementById('review');

  this.targetElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
scrollToElementfaq() {
  this.targetElement = document.getElementById('faq');

  this.targetElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
scrollToElementspc() {
  this.targetElement = document.getElementById('specification');

  this.targetElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
scrollToElementovr() {
  this.targetElement = document.getElementById('overview');

  this.targetElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}


ngOnDestroy(): void {
  this.subscriptions.map(s => s.unsubscribe());
}



} 