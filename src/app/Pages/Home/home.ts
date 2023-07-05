import { Component,OnInit,HostListener } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { HomeService } from 'src/app/SharedResources/Services/home.service';
import { errorHandlerService } from 'src/app/SharedResources/Services/errorHandler.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { environment } from 'src/environments/environment';
// import 'owl.carousel';
declare const $: any;



@Component({
    templateUrl: './home.html',
    styleUrls: ['./home.css']
})




export class HomeComponent implements OnInit { 
    slider_direction_rtl:boolean=false;
    load:boolean=false;
    logged_in:boolean=false;
    LANG:any;

    customOptions: OwlOptions = {
        loop: true,
        margin:0,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        nav:false,
        autoplay:true,
        animateOut: 'fadeOut',
        autoplayTimeout:4000,
        autoplaySpeed:1500,
        // navText:["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
        responsive: {
          0: {
            items: 1,
          },
          400: {
            items: 1
          },
          740: {
            items: 1
          },
          940: {
            items: 1
          }
        },
    }
    customOptions1: OwlOptions = {
      loop: true,
      margin:0,
      dots: false,
      navSpeed: 700,
      nav:false,
      autoplay:true,
      autoplayTimeout:4000,
      autoplaySpeed:500,
      // navText:["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
      responsive: {
        0: {
          items: 1,
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 1
        }
      },
  }

  bestSeller: OwlOptions = {
      // loop: true,
      margin:20,
      dots: false,
      nav:false,
      navSpeed: 700,
      // navText:["<img src='assets/images/icons/round-prev.png'/>","<img src='assets/images/icons/round-next.svg'/>"],
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      slideBy:'page',
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
          items: 1,
          margin:20,
        },
        940: {
          items: 1,
          margin:20,
        }
      },
      // nav: true
  }

  // testimonials: OwlOptions = {
  //   loop: true,
  //   center: true,
  //   margin:20,
  //   mouseDrag: false,
  //   touchDrag: false,
  //   pullDrag: false,
  //   dots: true,
  //   navSpeed: 700,
  //   navText:["",""],
  //   rtl:this.slider_direction_rtl,
  //   responsive: {
  //     0: {
  //       items: 1,
  //       margin:10,
  //     },
  //     400: {
  //       items: 1,
  //       margin:10,

  //     },
  //     740: {
  //       items: 2,
  //       margin:20,
  //     },
  //     940: {
  //       items: 2,
  //       margin:20,
  //     }
  //   },
  //   nav: true
  // }

    isMobile:boolean=false;
    home_page:any={};
    subscriptions:Subscription[]=[];



    constructor(private shared:SharedService,private router:Router,private homeService:HomeService,private error:errorHandlerService,private toast:ToastrManager,private cartService:CartService){
      this.subscriptions.push(this.shared.currentUserStatus.subscribe(user=>this.logged_in=user));
      this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
        this.changeLanguage();
        this.getHomePage();
      }))
      this.subscriptions.push(this.shared.countryChanged.subscribe((country_id:string) => {
        this.getHomePage();
      })) 
      this.onResize();
      this.changeLanguage();
      if(localStorage.getItem('logged_in') != undefined){
        this.logged_in=true;
        this.shared.changeUserStatus(true); 
      }
    }


    ngOnInit(){
      this.getHomePage();
      $('#slider').owlCarousel({
        loop: true,
        margin: 10,
        nav:false,
        dots:false,
        responsiveClass: true,
        autoplay:true,
        autoplayTimeout:3000,
        slideSpeed: 1000,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 1,
          }
        }
      });
    }
    
    @HostListener('window:resize', ['$event'])
    onResize(event?:any) {
        
      if(window.innerWidth < 768){
        this.isMobile=true;
        return
      }
      this.isMobile=false;
    }

    changeLanguage(){
      if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        // this.LANG=environment.arabic_translations;
        this.slider_direction_rtl=true;
        return
      }
      this.LANG=environment.english_translations;
      this.slider_direction_rtl=false;
    }

    getHomePage(){ 
      this.subscriptions.push(this.homeService.getHomePage().subscribe((result:any)=>{
        if(result.status){
          this.home_page=result.response;
          this.customOptions.rtl=this.slider_direction_rtl;
          this.customOptions1.rtl=this.slider_direction_rtl;
          this.bestSeller.rtl=this.slider_direction_rtl;   
          return
        }
      },(respagesError:any) => {
          const error = this.error.getError(respagesError);
          if(error == "Gateway timeout"){
              const arabic=localStorage.getItem("arabic")
              localStorage.clear()
              // if(!arabic || arabic == "true"){
              //     localStorage.setItem("arabic","true")
              // }else{
              //     localStorage.setItem("arabic","false")
              // }
              setTimeout(() => {
              this.getHomePage()
              }, 1000);
          return
        }
      }))
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
    if(data.stock == "2"){
      return
    }
    if(!this.logged_in){
      this.shared.emitModalOpen({id:data.id,type:2})
      return
    }
    data.load=true;
    const post_data={
        "product_id": data.id,
        "quantity": "1"
    }
    this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
        this.load=false;
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

  goToproductList(data?:any,type?:number){
    if(type === 1){
      this.router.navigate(['/products'],{ queryParams: { category_id: btoa(btoa(data.id))}});
      // this.openMenu();
      return
    }
    this.router.navigate(['/products']);
  }

  goToProductDetails(product_id:string){
    this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product_id))}})
  }

  category_all:boolean = false
  best_seller:boolean = false
  you_may_like:boolean= false
  view_all(event:any){
    if(event==1){
      this.category_all= true
    }
    if(event==2){
      this.best_seller= true
    }
    if(event==3){
      this.you_may_like= true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }


} 