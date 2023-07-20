import { Component, OnInit, HostListener } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { HomeService } from 'src/app/SharedResources/Services/home.service';
import { errorHandlerService } from 'src/app/SharedResources/Services/errorHandler.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { environment } from 'src/environments/environment';
import { ProductService } from 'src/app/SharedResources/Services/product.service';
import { style, animate, trigger, transition } from '@angular/animations';
// import 'owl.carousel';
declare const $: any;



@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.css']
  
})




export class HomeComponent implements OnInit {
  
  slider_direction_rtl: boolean = false;
  load: boolean = false;
  logged_in: boolean = false;
  LANG: any;
  product_id:string="";
  rating:any
  // max:any=5

  customOptions: OwlOptions = {
    loop: true,
    margin: 0,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    nav: false,
    autoplay: true,
    animateOut: 'fadeOut',
    autoplayTimeout: 4000,
    autoplaySpeed: 1500,
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
      },
      1200: {
        items:1
      }
    },
  }
  customOptions1: OwlOptions = {
    loop: true,
    margin: 0,
    dots: false,
    navSpeed: 700,
    nav: false,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplaySpeed: 500,
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
    margin: 20,
    dots: false,
    nav: false,
    navSpeed: 700,
    // navText:["<img src='assets/images/icons/round-prev.png'/>","<img src='assets/images/icons/round-next.svg'/>"],
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    slideBy: 'page',
    responsive: {
      0: {
        items: 2,
        margin: 10,
      },
      400: {
        items: 2,
        margin: 10,
      },
      740: {
        items: 1,
        margin: 20,
      },
      940: {
        items: 1,
        margin: 20,
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
  

  isMobile: boolean = false;
  home_page: any = {};
  subscriptions: Subscription[] = [];
  



  constructor(private shared: SharedService, private router: Router, private homeService: HomeService, private error: errorHandlerService, private toast: ToastrManager, private cartService: CartService, public productService: ProductService) {
    this.subscriptions.push(this.shared.currentUserStatus.subscribe(user => this.logged_in = user));
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
      this.getHomePage();
    }))
    this.subscriptions.push(this.shared.countryChanged.subscribe((country_id: string) => {
      this.getHomePage();
    }))
    this.onResize();
    this.changeLanguage();
    if (localStorage.getItem('logged_in') != undefined) {
      this.logged_in = true;
      this.shared.changeUserStatus(true);
    }
  }


  ngOnInit() {


    // const hasExecuted = localStorage.getItem('hasExecuted');
    // if (!hasExecuted) {
    //   this.modalpopup();
    //   // this.animationtext()     
    //    localStorage.setItem('hasExecuted', 'true');
    //    this.getHomePage();
    //    return
    // }

    // else if(hasExecuted){
    //   this.closemodal()
    // }
    
   
   

    this.getHomePage();
    // this.openmodal();
  //   $('#modal-slider').owlCarousel({
  //     loop:true,
  //     autoPlay:false,
  //     margin:10,
  //     nav:true,
  //     dots:false,
  //     navText: ["<span><i class='fa fa-arrow-left'></i></span>","<span><i class='fa fa-arrow-right'></i></span>"],
  //     responsiveClass:true,
  //     responsive:{
  //         0:{
  //             items:1,
  //             nav:true
  //         },
  //         600:{
  //             items:3,
  //             nav:false
  //         },
  //         1000:{
  //             items:1,
  //             nav:true,
  //             loop:false
  //         }
  //     }
  // })
    this.slidercarousel()
    


   

    
  }
  // openmodal(){
  //   $('#review-modal,.overlay-pop').addClass('show');
  // }
 
  slidercarousel(){
    $('#slider').owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      dots: false,
      responsiveClass: true,
      autoplay: true,
      autoplayTimeout: 3000,
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
  review:any
  insertRating(event:any){
    if(this.rating!=0){
      let data=  {"order_detail_id":event,"rating":this.rating,"comment":this.review}
      this.productService.insert_review(data).subscribe((res:any)=>{
        if(res.status==true){
          this.toast.successToastr(res.response.message)
          // this.closemodal()
        }
        if(res.status==false){
          this.toast.warningToastr(res.response.message)
        }
      })
    }
  

  
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {

    if (window.innerWidth < 768) {
      this.isMobile = true;
      return
    }
    this.isMobile = false;
  }

  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      // this.LANG=environment.arabic_translations;
      this.slider_direction_rtl = true;
      return
    }
    this.LANG = environment.english_translations;
    this.slider_direction_rtl = false;
  }

  video_player:any
  videoElement:any
  autoplayEnable:boolean = false

  getHomePage() {
    this.subscriptions.push(this.homeService.getHomePage().subscribe((result: any) => {
      if (result.status==true ) {
        
        this.home_page = result.response;

        console.log(this.home_page.cruise.video);
        this.video_player=this.home_page.cruise.video
        this.videoElement = document.getElementById('videoElement');
        this.autoplayEnable= true

        setTimeout(() => {
          this.videoElement.play();
        }, 1000);        console.log(this.videoElement);
        

        this.customOptions.rtl = this.slider_direction_rtl;
        this.customOptions1.rtl = this.slider_direction_rtl;
        this.bestSeller.rtl = this.slider_direction_rtl;
        // if(this.home_page.feedback_orders.length>0){
        //   this.openmodal()
        // }
        
        return
      }
    }, (respagesError: any) => {
      const error = this.error.getError(respagesError);
      if (error == "Gateway timeout") {
        const arabic = localStorage.getItem("arabic")
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


  addToWishlist(data: any) {
    if (!this.logged_in) {
      this.shared.emitModalOpen({ id: data.id, type: 1, wishlist: data.wishlist })
      return
    }
    this.subscriptions.push(this.cartService.addWishlist(data.id).subscribe((result: any) => {
      if (result.status) {
        if (result.response.status) {
          data.wishlist = "1";
          this.toast.successToastr(this.LANG.Product_added_to_wishlist, "", { position: "top-right", toastTimeout: 3000 });
          return
        }
        data.wishlist = "0";
        this.toast.successToastr(this.LANG.Product_removed_from_wishlist, "", { position: "top-right", toastTimeout: 3000 })
        return
      }
      this.toast.warningToastr(result.reponse.message, "", { position: "top-right", toastTimeout: 3000 })
    }))
  }
  guestLoginUser: any = false

  guestLogin(data: any, type?: number) {
    this.guestLoginUser= localStorage.getItem('guest_login')
    if (!this.logged_in && this.guestLoginUser!='true') {
      this.guestLoginUser = true

      this.productService.guestLogin().subscribe((res: any) => {
        localStorage.clear()
        // localStorage.setItem("logged_in", btoa("1"));
        localStorage.setItem("token", res.response.token);
        localStorage.setItem("guest_login", this.guestLoginUser)

        this.logged_in = true
        this.addToCart(data)
        return
      })

    }
    else if (this.logged_in || this.guestLoginUser=='true') {
      this.addToCart(data)
    }
  }
  Buynow(data: any, type?: number) {
    if (!this.logged_in) {
      this.guestLoginUser = true

      this.productService.guestLogin().subscribe((res: any) => {
        localStorage.clear()
        localStorage.setItem("logged_in", btoa("1"));
        localStorage.setItem("token", res.response.token);
        localStorage.setItem("guest_login", this.guestLoginUser)

        this.logged_in = true
        this.addToCart(data)
        return
      })

    }
    else if (this.logged_in) {
      this.addToCart(data)
    }
  }

  addToCart(data: any) {
    if (data.stock == "2") {
      return
    }
    if (!this.logged_in) {

    }
    data.load = true;
    const post_data = {
      "product_id": data.id,
      "quantity": "1"
    }
    this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result: any) => {
      this.load = false;
      if (result.status) {
        this.shared.changeCount(result.response.extra);
        data.load = false;
        this.toast.successToastr(this.LANG.Product_added_to_Cart, "", { position: "top-right", toastTimeout: 3000 });
        return
      }
      data.load = false;
      this.toast.warningToastr(result.response.message, "", { position: "top-right", toastTimeout: 3000 })

    }))
  }

  goToproductList(data?: any, type?: number) {
    if (type === 1) {
      localStorage.setItem('category_name',data.title)
      this.router.navigate(['/products'], { queryParams: { category_id: btoa(btoa(data.id)) } });
      // this.openMenu();
      return
    }
    if (type == 2) {
      if (data.product_id == 0) {
        this.router.navigate(['/products'], { queryParams: { category_id: btoa(btoa(data.category_id)) } });
        return
      }
      else if (data.category_id == 0) {
        this.router.navigate(['/product-details'], { queryParams: { product_id: btoa(btoa(data.product_id)) } });
        return
      }

    }
    this.router.navigate(['/products']);
  }

  goToProductDetails(product_id: string) {
    this.router.navigate(['/product-details'], { queryParams: { product_id: btoa(btoa(product_id)) } })
  }

  category_all: boolean = false
  best_seller: boolean = false
  you_may_like: boolean = false
  view_all(event: any) {
    if (event == 1) {
      this.category_all = true
    }
    if (event == 2) {
      this.best_seller = true
    }
    if (event == 3) {
      this.you_may_like = true
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }

  closemodal(){
    $("#review-modal,.overlay-pop").removeClass("show");
  }


  // modalpopup(){
  //   const myTimeout: ReturnType<typeof setTimeout> = setTimeout(myGreeting, 2300);

  //   function myGreeting(): void {
  //     const demoElement = document.getElementById("review-modal");
  //     if (demoElement) {
  //       demoElement.style.display = "none";
  //     }
  //   }
  //   setTimeout(function () {
  //     $('body').toggleClass('Scroll-wra');
  //     }, 0);
  //     setTimeout(function () {
  //       $('body').removeClass('Scroll-wra');
  //   }, 3500);
  // }
  // animationtext(){
  //   const words: string[] = [
  //     'Bonvoy',
  //   ];
  //   let part: string;
  //   let i: number = 0;
  //   let offset: number = 0;
  //   const len: number = words.length;
  //   let forwards: boolean = true;
  //   let skip_count: number = 0;
  //   const skip_delay: number = 15;
  //   const speed: number = 350;

  //   const wordflick = (): void => {
  //     setInterval(() => {
  //       if (forwards) {
  //         if (offset >= words[i].length) {
  //           ++skip_count;
  //           if (skip_count === skip_delay) {
  //             forwards = false;
  //             skip_count = 0;
  //           }
  //         }
  //       } else {
  //         if (offset === 0) {
  //           forwards = true;
  //           i++;
  //           offset = 0;
  //           if (i >= len) {
  //             i = 0;
  //           }
  //         }
  //       }
  //       part = words[i].substr(0, offset);
  //       if (skip_count === 0) {
  //         if (forwards) {
  //           offset++;
  //         } else {
  //           offset--;
  //         }
  //       }
  //       $('.word').text(part);
  //     }, speed);
  //   };

  //   $(document).ready(() => {
  //     wordflick();
  //   });

  // }





  
} 