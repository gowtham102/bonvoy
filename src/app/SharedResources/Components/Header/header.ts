import { Component, OnInit, HostListener, Inject, ViewChild, EventEmitter, Output, ElementRef, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../Services/shared.service';
import { Subscription, timer } from 'rxjs';
import { HeaderService } from '../../Services/header.service';
import { NavigationEnd, Router } from '@angular/router';
// import firebase from 'firebase/app';
import * as firebase from 'firebase/app';
import { WindowService } from 'src/app/SharedResources/Services/window.service';
import { login_data } from '../../Models/login.model'


// import 'firebase/auth';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../Services/login.service';
import { errorHandlerService } from '../../Services/errorHandler.service';
import { registration_data } from '../../Models/registration.model'
import { CartService } from '../../Services/cartWishlist.service';
import { filter } from 'rxjs/operators';
import { HomeService } from '../../Services/home.service';
import { ProductService } from '../../Services/product.service';
declare const $: any;






@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.css']
})

export class HeaderComponent implements OnInit {
  
    isMobile:boolean=true;
    logged_in:boolean=true;
    show_menu:boolean=true;
    isCollapsed:boolean = true;
    sticky_header:boolean=false;
    show_otp:boolean=false;
    show_password:boolean=false;
    selected_language:string="English";
    optional_language:string="Arabic";
    selected_flag_img:string="assets/images/icons/en.png";
    optional_flag_img:string="assets/images/icons/saudi.svg";
    arabic:boolean=false;
    country_list:any=[];
    city_list:any=[];
    country_data:any={};
    city_data:any={};
    cart_count:string="0";
    menu_data:any={};
    categories:any=[];
    windowRef: any;
    login_error:any={};
    showResend:boolean=false;
    otp1:string="";
    otp2:string="";
    otp3:string="";
    otp4:string="";
    otp5:string="";
    otp6:string="";
    downloadTimer:any;
    count:number=0;
    mobile_number:string="";
    password:string="";
    country_code:string="";
    load:boolean=false;
    err:boolean=false;
    LANG:any=environment.english_translations;
    registration_error:any={};
    full_name:string="";
    email:string="";
    new_password:string="";
    confirm_password:string="";
    subscriptions:Subscription[]=[]
    profileImageFile:any;
    profileImage:string="assets/images/icons/user-round.svg";
    profile_image_selected:boolean=false;
    progress:any;
    product_data:any;
    search_keyword:string="";
    search_results:any=[];
    result_tab:boolean=false;
    no_result:boolean=false;
    user_data:any={};
    user_profile:any={};
    footer_data:any={};
    unSubscriptionTimer: Subscription;
    window_ref:any=window

    @ViewChild('loginModal') login_modal: any;
    @ViewChild('registrationModal') register_modal: any;
    @Output() logoutUser:EventEmitter<any> = new EventEmitter();   
    @ViewChild('search_menu') search_menu!: ElementRef;
    @ViewChild('search_btn') search_btn!: ElementRef;
    @ViewChild('search_result') search_result!: ElementRef;
    @ViewChild('search_input') search_input!: ElementRef;
    
    

   

    constructor(@Inject(DOCUMENT) private document: Document,private win: WindowService,private headerService:HeaderService,private modalService: NgbModal,private shared:SharedService,private router:Router,private toast:ToastrManager,private loginService:LoginService,private error:errorHandlerService,private cartService:CartService,private renderer: Renderer2,public productService:ProductService){
      this.subscriptions.push(this.shared.currentUserStatus.subscribe(user=>this.logged_in=user));
      this.subscriptions.push(this.shared.currentCount.subscribe(count=>this.cart_count=count));
      this.subscriptions.push(this.shared.currentCountryList.subscribe((data:any) =>this.country_list=data));
      this.subscriptions.push(this.shared.currentUserData.subscribe((data:any) =>this.user_data=data));
      this.subscriptions.push(this.shared.currentUserData.subscribe((data:any) =>this.user_profile=data));
      this.subscriptions.push(this.shared.currentFooterData.subscribe((data:any) =>this.footer_data=data));
      this.languageChange();
      this.onResize();
      this.unSubscriptionTimer=Subscription.EMPTY;
      // firebase.initializeApp(environment.firebaseConfig);
      this.shared.modalOpen.subscribe((data:any)=>{
        if(data.id || data.redirection){
          this.product_data=data;
          this.openLoginModal(this.login_modal);
          return
        }
        if(data.logout){
          this.logout(1)
          this.openLoginModal(this.login_modal);
          return
        }
      })
      if(localStorage.getItem('logged_in') != undefined){
        this.logged_in=true;
        this.shared.changeUserStatus(true); 
      }
      const country_info=btoa(btoa('country_info'));
      if(localStorage.getItem(country_info) != undefined){
        // this.country_data=JSON.parse(atob(atob(localStorage.getItem(country_info) || '{}')));
        this.city_data=JSON.parse(atob(atob(localStorage.getItem(country_info) || '{}')));
      }
      const user_info=btoa(btoa("user_info"));
      if(localStorage.getItem(user_info) != undefined){
          this.user_data=JSON.parse(decodeURIComponent(escape(atob(atob(localStorage.getItem(user_info) || "")))));
          this.shared.changeUserData(this.user_data);
      }
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)  
      ).subscribe((event: any) => {
        this.isCollapsed=true;
        this.result_tab=false;
        this.search_keyword="";
        this.search_results=[];
        this.no_result=false;
      });

      this.renderer.listen('window', 'click',(e:Event)=>{
        const target = e.target as HTMLElement;
        const parent = target?.parentElement?.parentNode;
        if(parent !== this.search_menu?.nativeElement && parent !== this.search_btn?.nativeElement && parent !== this.search_result?.nativeElement && target !== this.search_input?.nativeElement){
          this.isCollapsed=true;
          this.result_tab=false;
          this.search_keyword="";
          this.search_results=[];
          this.no_result=false;
       }
   });

 
      
    }

    ngOnInit(){
      this.windowRef = this.win.windowRef;
      this.getMenu();
      this.getCart()
    }

    // ngAfterViewInit(){
    //   this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{
    //       size: 'invisible',
    //       callback: (response:any)=> {
    //       }
    //   });
    // }

    @HostListener('window:resize', ['$event'])
    onResize(event?:any) {
        
      if(window.innerWidth < 768){
        this.isMobile=true;
        this.show_menu=false;
        return
      }
      this.isMobile=false;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      if(window.scrollY >= 250 && !this.isMobile){
        this.sticky_header=true;
        return
      }
      if(window.scrollY >= 250 && !this.show_menu && this.isMobile){
        this.sticky_header=true;
        return
      }
      this.sticky_header=false;
    }

    showFileInput(fileInput:HTMLInputElement){
      fileInput.click()
    }
    guest_login:any
    windowReload(){
      this.guest_login=  localStorage.getItem('guest_login')
      if(this.router.url=='/my-cart'){
        
          if( !localStorage.getItem('firstLoad') )
          {
            localStorage['firstLoad'] = true;
            window.location.reload();
          }  
          else
            localStorage.removeItem('firstLoad');
        
        }
      }
    

    openMenu(){
        // if(!this.show_menu && this.isMobile){
        //   this.document.documentElement.style.overflowY = 'auto';
        // }else{
        //   this.document.documentElement.style.overflowY = 'auto';
        // }
        this.show_menu=!this.show_menu;
    }

    openLoginModal(content:any,type?:1) {
      this.clearData();
      this.modalService.dismissAll();
      this.show_otp=false;
      this.show_password=false;
      this.country_code=this.country_list.length > 0 ? this.country_list[0].country_code : "+91";
      this.modalService.open(content,{ centered: true , windowClass: 'login-modal' });
      if(type == 1){
        this.product_data={}
      }
    } 

    openRegistrationModal(content:any) {
    
        this.modalService.dismissAll();
        this.modalService.open(content,{ centered: true , windowClass: 'login-modal' });
      
      
    } 

    showLoginPassword(){
      this.clearData(1);
      this.show_password=!this.show_password;
    }

    changeLanguage(type?:number){
      if(this.optional_language == "Arabic"){
        localStorage.setItem("arabic","true");
        this.document.documentElement.classList.add('arabic');
        this.selected_flag_img="assets/images/icons/saudi.svg";
        this.optional_flag_img="assets/images/icons/en.png";
        this.selected_language="Arabic";
        this.optional_language="English";
        this.arabic=true;
        this.shared.emitLanguageChange(location.pathname);
        // this.LANG = environment.arabic_translations;
        if(!type){
          this.getMenu();
        }
        return
      }
      localStorage.setItem("arabic","false");
      this.selected_flag_img="assets/images/icons/en.png";
      this.optional_flag_img="assets/images/icons/saudi.svg"
      this.document.documentElement.classList.remove('arabic');
      this.selected_language="English";
      this.optional_language="Arabic";
      this.arabic=false;
      this.shared.emitLanguageChange(location.pathname);
      this.LANG = environment.english_translations;
      if(!type){
        this.getMenu();
      }
  }

  languageChange(){
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        this.optional_language="Arabic";
        this.changeLanguage(1);
        return
    }
    this.optional_language="English"
    this.changeLanguage(1);      
  }

  getMenu(){
    this.subscriptions.push(this.headerService.getMenu().subscribe((result:any)=>{
        if(result.status){
            this.menu_data=result.response;
            this.categories=result.response.category;
            this.country_list=result.response.country;
            this.city_list=result.response.city;
            this.shared.changeCountryList(result.response.country);
            const footer_data={utility:result.response.utility[0],category:result.response.category}
            const user_profile={user_name:result.response.user_name,profile_image:result.response.profile_image  || "assets/images/icons/user-round.svg"}
            this.shared.changeUserProfile(user_profile);
            this.shared.changeFooterData(footer_data)

            this.country_code=result.response.country.length > 0 ? result.response.country[0].country_code : "+91";
            this.cart_count=result.response.cart_count;
            // if(!this.country_data.country_id && this.country_list.length > 0){
            //   this.country_data={
            //     country_id:this.country_list[0].id,
            //     country_title:this.country_list[0].name,
            //     country_flag:this.country_list[0].image,
            //   }
            // }
            if(!this.city_data.city_id && this.city_list.length > 0){
              this.city_data={
                city_id:this.city_list[0].id,
                city_title:this.city_list[0].name,
              }
            }
            if(result.response.city_id == "0" || result.response.city_id == ""){
              const data={
                  "id":this.city_data.city_id,
                  "name":this.city_data.city_title,
              }
              this.updateCity(data) 
             }
            localStorage.setItem("country_id",btoa(btoa(this.city_data.city_id)));
        }
    }))
  }

  // updateCountry(data:any){
  //   this.load=true;
  //   this.subscriptions.push(this.headerService.updateCountry(data.id).subscribe((result:any)=>{
  //     if(result.status){
  //       this.shared.changeCount(result.extra || "0");
  //       this.country_data={
  //           country_id:data.id,
  //           country_title:data.name,
  //           country_flag:data.image,
  //       } 
  //       localStorage.setItem(btoa(btoa(("country_info"))), btoa(btoa(JSON.stringify(this.country_data))));
  //       localStorage.setItem("country_id",btoa(btoa(data.id)));
  //       this.shared.emitCountryChanged(data.id);
  //       this.load=false;
  //       return
  //     }
  //     this.load=false;
  //   }))
  // }

  updateCity(data:any){
    this.load=true;
    this.subscriptions.push(this.headerService.updateCity(data.id).subscribe((result:any)=>{
      if(result.status){
        this.shared.changeCount(result.extra || "0");
        this.city_data={
            city_id:data.id,
            city_title:data.name,
        } 
        localStorage.setItem(btoa(btoa(("country_info"))), btoa(btoa(JSON.stringify(this.city_data))));
        localStorage.setItem("country_id",btoa(btoa(data.id)));
        this.shared.emitCountryChanged(data.id);
        this.load=false;
        this.getMenu();
        return
      }
      this.load=false;
    }))
  }

  goToproductList(data:any,type?:number){
    if(type === 1){
      localStorage.setItem('category_name',data.title)
      this.router.navigate(['/products'],{ queryParams: { category_id: btoa(btoa(data.id))}});
      this.openMenu();
      return
    }
    if(type === 2){
      localStorage.setItem('sub_category_name',data.title)
      this.router.navigate(['/products'],{ queryParams: { sub_category_id: btoa(btoa(data.id))}});
      this.openMenu();
      return
    }
    this.router.navigate(['/products'],{ queryParams: { occasion_id: btoa(btoa(data.id))}});
    this.openMenu();
  }

  //user authentication



// otpFromFirebase(mobile_number:string,type?:number){
//     const appVerifier = this.windowRef.recaptchaVerifier;

//     const num = `${this.country_code}${mobile_number}`;
//     firebase.auth().signInWithPhoneNumber(num, appVerifier)
//         .then(result => {
//             this.load=false;
//               this.windowRef.confirmationResult = result;
//               this.resetError();
//               if(type == 1){
//                 this.clearOTP()
//                 this.resendOTP();
//                 const numbers = timer(31750);
//                 this.unSubscriptionTimer=numbers.subscribe(() => { 
//                   this.showResend=true; 
//                 });
//                 return
//               }
//               this.show_otp=true;
//               this.showResend=true;
//               const time=timer(1000);
//               this.subscriptions.push(time.subscribe(()=>{
//                 const input=this.getCodeBoxElement(1);
//                 input?.focus();
//               }))
//         })
//         .catch( error => {
//           this.load=false;
//         })
// }

otpFromPhp(mobile_number:string,type?:number){
  const data={
    "mobile_number": mobile_number,
    "country_code": this.country_code
  }
  this.subscriptions.push(this.loginService.sendOtp(data).subscribe((result:any)=>{
    if(result.status){
      this.load=false;
      this.windowRef.confirmationResult = result;
      this.resetError();
      if(type == 1){
        this.clearOTP()
        this.resendOTP();
        return
      }
      this.show_otp=true;
      this.showResend=true;
      const time=timer(1000);
      this.subscriptions.push(time.subscribe(()=>{
        const input=this.getCodeBoxElement(1);
        input?.focus();
      }));
      return
    }
    this.load=false;
    this.toast.warningToastr(result.message,"",{position:'top-right',toastTimeout:3000})
  }))
}



sendOTP(){
  if(this.mobile_number==""){
    this.toast.warningToastr("PleASE ENTER THE MOBILE NUMBER")
    this.login_error.mobile_number= true
    return
  }
    this.err=false;
    this.resetError();
    this.errorHandler();
    if(!this.err){
        this.load=true;
        if(this.show_password){
            this.checkMobile();
            return
        }
        this.otpFromPhp(this.mobile_number);
    }
}

guestLogin:any= false
token:any

loginUser(){
  this.token=localStorage.getItem("token")
    const data:login_data={
        "device_type":"1",             
        "mobile_number": this.mobile_number,      
        "password": this.loginService.encryptPassword(this.password), 
        "country_code": this.country_code,
        "token":this.token
    }
    if(!this.show_password){
        const otp=this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6;
        const post_data={
          "mobile_number": this.mobile_number,      
          "country_code": this.country_code,
          "otp": otp, 
          "token":this.token

        }
        this.loginWithOtp(post_data);
        return
    }
    this.subscriptions.push(this.loginService.userLogin(data).subscribe((result:any)=>{
        if(result.response.token){
            this.user_data=result.response;
            localStorage.setItem("logged_in", btoa("1"));
            localStorage.setItem("token", result.response.token);
            localStorage.setItem("guest_login",this.guestLogin)
            localStorage.setItem(btoa(btoa(("user_info"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(result.response))))));
            this.shared.changeCount(result.count || "0");
            this.shared.changeUserStatus(true);
            this.shared.changeUserData(result.response);
            const user_profile={user_name:result.response.full_name,profile_image:result.response.profile_image  || "assets/images/icons/user-round.svg"}
            this.shared.changeUserProfile(user_profile);
            const city_name=this.city_list.find((item:any) => item.id === result.response.city_id);
            if(city_name){
              const data={
                "id":result.response.city_id,
                "name":city_name.name,
              }
              this.updateCity(data)
            }
            if(this.product_data && this.product_data.id){
              if(this.product_data.type == 1){
                this.addToWishlist(this.product_data)
              }else{
                this.addToCart(this.product_data)
              }
            }
            if(this.product_data && this.product_data.redirection){
              this.router.navigate(['/'+this.product_data.redirection]);
            }
            this.modalService.dismissAll();
            this.load=false;
            this.toast.successToastr(this.LANG.Login_successfull_Welcome+result.response.full_name,"",{position:'top-right',toastTimeout:3000});
            this.windowReload()
            return
        }
        this.load=false;
        this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'})
    }))
}

getCart(){ 
  this.subscriptions.push(this.cartService.getCartDetails().subscribe((result:any)=>{
    
  }))
}

loginWithOtp(data:any){
  this.subscriptions.push(this.loginService.loginWithOtp(data).subscribe((result:any)=>{
    if(result.response.token){
        this.user_data=result.response;
        localStorage.setItem("logged_in", btoa("1"));
        localStorage.setItem("token", result.response.token);
        localStorage.setItem("guest_login",this.guestLogin)

        localStorage.setItem(btoa(btoa(("user_info"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(result.response))))));
        this.shared.changeCount(result.count || "0");
        this.shared.changeUserStatus(true);
        this.shared.changeUserData(result.response);
        const user_profile={user_name:result.response.full_name,profile_image:result.response.profile_image  || "assets/images/icons/user-round.svg"}
        this.shared.changeUserProfile(user_profile);
        const city_name=this.city_list.find((item:any) => item.id === result.response.city_id);
        if(city_name){
          const data={
            "id":result.response.city_id,
            "name":city_name.name,
          }
          this.updateCity(data)
        }
        if(this.product_data && this.product_data.id){
          if(this.product_data.type == 1){
            this.addToWishlist(this.product_data)
          }else{
            this.addToCart(this.product_data)
          }
        }
        if(this.product_data && this.product_data.redirection){
          this.router.navigate(['/'+this.product_data.redirection]);
        }
        this.modalService.dismissAll();
        this.load=false;
        this.toast.successToastr(this.LANG.Login_successfull_Welcome+result.response.full_name,"",{position:'top-right',toastTimeout:3000});
        this.windowReload()
        return
    }
    this.load=false;
    this.clearOTP();
    this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'})
}))
}

checkMobile(otp?:string){
  this.load=true;
  let data={"mobile_number":this.mobile_number,"country_code":this.country_code}
  this.subscriptions.push(this.loginService.checkMobile(data).subscribe((result:any)=>{
      if(result.status){  
          this.loginUser();
          return
      }
      if(result.response.status){  
          this.loginUser();
          return
      }
      if(this.show_password){
          this.load=false;
          this.toast.warningToastr(this.LANG.You_are_not_registered_with_us,"",{position:"top-right",toastTimeout:3000,maxShown:1,animate:'null'})
          return
      }
      if(otp){
        this.verifyOtpPhp(otp)        
      }
    },(respagesError:any) => {
      this.load=false;
      const error = this.error.getError(respagesError);
      if(error == "Gateway timeout"){
        return
      }
      this.toast.errorToastr(error,this.LANG.Error,{position:'top-right',toastTimeout:3000})
  }));
}


verifyOtp(){
    this.err=false;
    this.resetError();
    const otp=this.otp1+this.otp2+this.otp3+this.otp4+this.otp5+this.otp6;
    if(otp.length != 6){
      this.login_error.otp=true;
      this.err=true;	
    }
    if(!this.err){
      this.load=true;
      this.checkMobile(otp)
    }
}

// verifyOtpFirebase(otp:string){
//   this.windowRef.confirmationResult
//   .confirm(otp)
//   .then((result:any) => {
//     this.load=false;
//     this.checkMobile()
//   })
//   .catch( (error:any) => {
//   this.load=false;
//   var errorCode=error.code;
//   var a=errorCode.split('/')
//   if(a[1]=="invalid-verification-code"){
//   this.clearOTP();
//   this.toast.warningToastr("",this.LANG.Invalid_OTP,{position:'top-right',toastTimeout:3000})
//   }else{
//   this.toast.warningToastr(this.LANG.Something_went_wrong_Please_try_again_later,"",{position:'top-right',toastTimeout:3000})
//   }
//   });
// }

verifyOtpPhp(otp:string){
  const data={
    "mobile_number": this.mobile_number,
    "country_code": this.country_code,
    "otp": otp
  }
  this.subscriptions.push(this.loginService.verifyOtp(data).subscribe((result:any)=>{
    if(result.status){
      this.load=false;
      this.modalService.dismissAll();
      this.openRegistrationModal(this.register_modal)
      return
    }
    this.load=false;      
    this.clearOTP();
    this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000})
  }))
}

errorHandler(){
    this.mobileErrorHandler();
    if(this.show_password){
        if(this.password == "" || this.password == undefined){
            this.login_error.password=true;
            this.err=true;
        }
        if(!this.login_error.password && this.checkPassword(this.password)){
            this.login_error.password_valid=true;	
            this.err=true;
        }
    }
}


mobileErrorHandler(){
  if(this.mobile_number == ""  || this.mobile_number == undefined){
    this.login_error.mobile_number=true;	
    this.err=true;
  }
  if(this.country_code == "+966"){
    const re=/^([0]{1}[5]{1}[0-9]*)$/
    const re1=/^([5]{1}[0-9]*)$/
    if(!this.login_error.mobile_number && !re.test(this.mobile_number) && !re1.test(this.mobile_number)){
      this.login_error.mobile_number_valid=true;	
      this.err=true;
    }

    if(!this.login_error.mobile_number && re.test(this.mobile_number) && this.mobile_number.length != 10){
      this.login_error.mobile_number_valid=true;
      this.err=true;	
    }

    if(!this.login_error.mobile_number && re1.test(this.mobile_number) && this.mobile_number.length != 9){
      this.login_error.mobile_number_valid=true;
      this.err=true;	
    }
    return
  }
  if(this.country_code == "+91"){
    if(this.login_error.mobile_number == false && this.mobile_number.length != 10){
      this.login_error.mobile_number_valid=true;
      this.err=true;	
    }
    return
  }
  if(this.login_error.mobile_number == false && (this.mobile_number.length < 8 || this.mobile_number.length > 10)){
    this.login_error.mobile_number_valid=true;
    this.err=true;	
  }
}

changeCountryCode(country_code:string){
  this.country_code=country_code;
  this.login_error.mobile_number_valid=false;
}

resetError(){
    this.login_error={
      "mobile_number":false,
      "mobile_number_valid":false,
      "password":false,
      "password_valid":false,
      "otp":false,
    }
    this.registration_error={
      "full_name":false,
      "email_id":false,
      "email_id_valid":false,
      "new_password":false,
      "new_password_valid":false,
      "confirm_password":false,
      "password_match":false,
      "confirm_password_valid":false,
    }
}

clearData(type?:number){
    this.resetError();
    this.clearRegistrationData()
    const mobile_number=this.mobile_number;
    this.mobile_number="";
    this.password="";
    this.show_otp=false;
    this.load=false;
    this.clearOTP();
    if(type == 1){
        this.mobile_number=mobile_number;
    }
    if(this.unSubscriptionTimer){
        this.unSubscriptionTimer.unsubscribe()
    }
    clearInterval(this.downloadTimer);
}

clearRegistrationData(){
  this.email="";
  this.full_name="";
  this.new_password="";
  this.confirm_password="";
  this.profileImage="assets/images/icons/user-round.svg";
  this.profileImageFile="";
  this.profile_image_selected=false;
  if(this.unSubscriptionTimer){
    this.unSubscriptionTimer.unsubscribe();
  }
}

clearOTP(){
    this.otp1="";
    this.otp2="";
    this.otp3="";
    this.otp4="";
    this.otp5="";
    this.otp6="";
}

checkPassword(password:string){
  if(password.length < 8){
      return true
  }
  return
}

resendAgain(){
  this.showResend=false
  this.count+=1;
  if(this.count<=3){
    this.otpFromPhp(this.mobile_number,1);
  }else{
    this.toast.warningToastr(this.LANG.You_exceeded_OTP_request_max_attempt,"",{position:"top-right",toastTimeout:3000,maxShown:1,animate:'null'})
  }
}

resendOTP(){
  let timeleft = 30;
  this.downloadTimer = setInterval(()=>{
  if(timeleft < 0){
    this.document.getElementById("countdown")!.innerHTML = "";
    clearInterval(this.downloadTimer);
    this.showResend=true; 
  } else {
    if(this.document.getElementById("countdown")){
      this.document.getElementById("countdown")!.innerHTML =`<p>Wait for ${timeleft} seconds to resend</p>`;
    }
  }
    timeleft -= 1;
  }, 1000);
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

//register user


changeProfileImage(event:any) {
  let file = event.target.files[0];
  let ext=file.type.split('/').pop().toLowerCase();
  if(ext !== "jpeg" && ext !== "jpg" && ext !== "png"){
      this.toast.warningToastr("",file.name + this.LANG.is_not_a_valid_file,{position:"top-right",toastTimeout:3000,maxShown:1,animate:'null'})
      return false
  }
  if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
      this.profileImage=e.target.result;
      this.profileImageFile=file
      this.profile_image_selected=true;
      }
      reader.readAsDataURL(file);
  }
  return
}


uploadProfileImage() {
    var n = Date.now();
    var fileName = this.profileImageFile.name;
    var path = fileName + n
    const filePath = `Profile/${path}`;
    const uploadTask =
    firebase.storage().ref().child(`${filePath}`).put(this.profileImageFile);
    uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.progress = progress
        },
        error => console.log(error),
        async () => {
        await uploadTask.snapshot.ref.getDownloadURL().then(res => {
            this.profileImage=res;
            this.registerUser();
        });
        }
    );
}


register(){
  this.err=false;
  this.resetError();
  this.registerErrorHandler();
  if(!this.err){
    this.load=true;
    if(!this.profile_image_selected){
        this.registerUser();
        return
    }
    this.uploadProfileImage();
  }
}

registerUser(){
  const data:registration_data={
      "registerd_from":"1",
      "country_code": this.country_code,
      "mobile_number": this.mobile_number,
      "email_id": this.email,       
      "full_name": this.full_name,
      "password": "",
      "profile_image":this.profileImage
    }
    if(this.new_password){
      data.password=this.loginService.encryptPassword(this.new_password)
    }
    this.subscriptions.push(this.loginService.register(data).subscribe((result:any)=>{
      this.load=false;
      if(result.response.token){
          this.user_data=result.response;
          localStorage.setItem("logged_in", btoa("1"));
          localStorage.setItem("token", result.response.token);
          localStorage.setItem("guest_login",this.guestLogin)

          localStorage.setItem(btoa(btoa(("user_info"))), btoa(btoa(unescape(encodeURIComponent(JSON.stringify(result.response))))));
          this.shared.changeCount(result.count || "0");
          this.shared.changeUserStatus(true);
          this.shared.changeUserData(result.response);
          const user_profile={user_name:result.response.full_name,profile_image:result.response.profile_image}
          this.shared.changeUserProfile(user_profile);
          this.toast.successToastr(this.LANG.Registration_successfull_Welcome+result.response.full_name,"",{position:'top-right',toastTimeout:3000});
          this.windowReload()
          this.clearData();
          this.modalService.dismissAll();
          const city_name=this.city_list.find((item:any) => item.id === result.response.city_id)?.name;
            const data={
              "id":result.response.city_id,
              "name":city_name,
            }
          this.updateCity(data)
          return
      }
      this.profile_image_selected=false;
      this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000})
      
    },respagesError => {
      this.load=false;
      const error = this.error.getError(respagesError);
      if(error == "Gateway timeout"){
        return
      }
      this.toast.errorToastr(error,this.LANG.Error,{position:'top-right',toastTimeout:3000})
    }));
}



registerErrorHandler(){
  if(this.full_name == "" || this.full_name == undefined){
      this.registration_error.full_name=true;
      this.err=true;
  }


  if(this.email && this.checkEmail(this.email)){
    this.registration_error.email_id_valid=true;
    this.err=true;
  }

  // if(this.email == "" || this.email == undefined){
  //   this.registration_error.email_id=true; 
  //   this.err=true;
  // }

  // if(!this.registration_error.email_id && this.checkEmail(this.email)){
  //   this.registration_error.email_id_valid=true;
  //   this.err=true;
  // }
  this.passwordErrorHandler();
}

passwordErrorHandler(){
  // if(this.new_password == "" || this.new_password == undefined){
  //   this.registration_error.new_password=true;
  //   this.err=false;
  // }

  if(this.new_password && this.checkPassword(this.new_password)){
    this.registration_error.new_password_valid=true;	
    this.err=true;
  }  

  // if(this.confirm_password == "" || this.confirm_password == undefined){
  //   this.registration_error.confirm_password=true;	
  //   this.err=true;
  // }


  if(this.new_password && this.confirm_password == ""){
    this.registration_error.confirm_password=true;	
    this.err=true;
  }

  if(!this.registration_error.new_password_valid && this.new_password != this.confirm_password && !this.registration_error.confirm_password){
      this.registration_error.password_match=true;	
      this.err=true;
  }
}


checkEmail(email:string){
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !re.test(email)
}

//cart and wishlist


addToWishlist(data:any){
  this.subscriptions.push(this.cartService.addWishlist(data.id).subscribe((result:any)=>{
      if(result.status){
        if(result.response.status){
          data.wishlist="1";
          this.toast.successToastr(this.LANG.Product_added_to_wishlist,"",{position:"top-right",toastTimeout:3000});
          return
        }
        data.wishlist="0";
        this.toast.successToastr(this.LANG.Product_removed_from_wishlist,"",{position:"top-right",toastTimeout:3000})
        return
      }
        this.toast.warningToastr(result.reponse.message,"",{position:"top-right",toastTimeout:3000}) 
  }))
}

addToCart(data:any){
  const post_data={
      "product_id": data.id,
      "quantity": "1"
  }
  this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
      if(result.status){
          this.shared.changeCount(result.response.extra);
          data.load=false;
          this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});
          return
      }
      data.load=false;
      this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
      
  }))
}

logout(type?:number){
  const data={};
  this.headerService.logout(data).subscribe(result=>{
      if(result){
          // firebase.auth().signOut().then(()=> {
          // }).catch((error)=> {
          // });
          const arabic=localStorage.getItem("arabic")
          localStorage.clear()
          if(arabic == "true"){
            localStorage.setItem("arabic","true")
          }
          this.logged_in=false;
          this.shared.changeUserStatus(false)
          this.shared.changeCount("0")
          if(!type){
            this.toast.successToastr(this.LANG.Logout_Successfully,"",{position:'top-right',toastTimeout:3000});
          }
          this.router.navigate(['/'])
          
      }else{
          this.toast.warningToastr(result['message'],"",{position:'top-right',toastTimeout:3000})
      }
  },respagesError => {
      const error = this.error.getError(respagesError);
      if(error == "Gateway timeout"){
        return
      }
      this.toast.errorToastr(error,this.LANG.Error,{position:'top-right',toastTimeout:3000})
  })
}

onSearchClick(data:any){
        this.result_tab=false;
        this.search_results=[];
        this.search_keyword="";
        this.isCollapsed=true;
        if(data.type == "1"){
            this.router.navigate(['/products'],{ queryParams: { category_id: btoa(btoa(data.id))}});
            return
        }if(data.type == "2"){
            this.router.navigate(['/products'],{ queryParams: { occasion_id: btoa(btoa(data.id))}})
            return        
        }
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(data.id))}})        
    } 

    search(event:any){
            const search_key=event.target.value;
            if(search_key.length > 0){
                let data={"search":search_key}
                this.subscriptions.push(this.headerService.search(data).subscribe((result:any)=>{
                    if(result.response.length > 0){  
                        this.search_results=result.response;
                        this.result_tab=true;
                        this.no_result=false;
                        return
                    }
                    this.search_results=result.response;
                    this.result_tab=true;
                    this.no_result=true;
                    const time=timer(3000);
                    this.subscriptions.push(time.subscribe(()=>{
                      this.search_results=[];
                      this.result_tab=false;
                      this.no_result=false;
                    }))
                }))   
                return;         
            } 
            setTimeout(() => {
                this.search_results=[]
                this.result_tab=false;
                this.no_result=false;
            }, 200);
    }

    clearSearch=()=>{
        this.search_keyword=""
        this.search_results=[]
        this.result_tab=false;
        this.no_result=false
    }


ngOnDestroy(): void {
  if(this.unSubscriptionTimer){
    this.unSubscriptionTimer.unsubscribe()
  }
  this.subscriptions.map(s => s.unsubscribe());
}

downloadApp(){
  var userAgent = navigator.userAgent || navigator.vendor || this.window_ref.opera;
  if (/iPad|iPhone|iPod/.test(userAgent) && !this.window_ref.MSStream) {
    window.open(this.menu_data.utility[0].app_store, '_blank');
    return
  }
  window.open(this.menu_data.utility[0].play_store, '_blank');
}





searchopen(){
  $(".pop").toggleClass('show')
}
searchclose(){
  $(".pop").removeClass('show')
}
  // menu_slider:boolean=false
  menu(){

    $(".menu-open,.overlay-pop1").toggleClass("show");
  
}

showSubMenu: { [menuName: string]: boolean } = {};
  currentMenu:any
  hideTimer: any;
  showSubmenu(menu: any): void {
    this.currentMenu = menu;
    }

    hideSubmenu(): void {
      this.hideTimer = setTimeout(() => {
        this.currentMenu = null;
      }, 500); // Adjust the delay as needed (milliseconds)
    }
  
    cancelHideSubmenu(): void {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    }

// cartCheck(){
//   if( !this.guestLogin && !this.logged_in){
//     this.productService.guestLogin().subscribe((res:any)=>{
//       this.token = res.response.token
//       localStorage.setItem("token",this.token)
//       this.router.navigate(['/my-cart'])
//     })
    
//     return
//   }
//   // if(!this.logged_in){
//   //   this.productService.guestLogin().subscribe((res:any)=>{
//   //     this.token = res.response.token
//   //     localStorage.setItem("token",this.token)
//   //     this.router.navigate(['/my-cart'])
//   //   })
//   //   return
//   // }
//   else {
//     this.router.navigate(['/my-cart'])
//   }
// }
} 