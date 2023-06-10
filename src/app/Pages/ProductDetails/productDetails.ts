import { Component,OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/SharedResources/Services/product.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";

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


    constructor(private productService:ProductService,private route:ActivatedRoute,private cartService:CartService,private router:Router,private toast:ToastrManager,private shared:SharedService){
      this.subscriptions.push(this.shared.currentUserStatus.subscribe(user=>this.logged_in=user));
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
      this.changeLanguage();
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

  addToCart(data:any,type?:number){
    if(data.stock == "2"){
      return
    }
    if(!this.logged_in){
      this.shared.emitModalOpen({id:data.id,type:2})
      return
    }
    const post_data={
        "product_id": data.id,
        "quantity":"1"
    }
    if(type == 1){
      post_data.quantity=data.quantity;
      this.load=true;
    }else{
      data.load=true;
    }
    this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
        this.load=false;
        if(result.status){
            this.shared.changeCount(result.response.extra);
            data.load=false;
            this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});
            if(type == 1){
              setTimeout(() => {
                  this.router.navigate(['/my-cart']);
              }, 100);
            }
            return
        }
        this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
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
   

      



} 