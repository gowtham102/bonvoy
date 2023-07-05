import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/SharedResources/Services/product.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";
declare const $: any;



@Component({
    templateUrl: './productList.html',
    styleUrls: ['./productList.css']

})




export class ProductListComponent implements OnInit { 
    activeIds:any=[];
    show_mobile_filter:boolean=false;
    logged_in:boolean=false;
    load:boolean=false;
    products_loaded:boolean=false;
    index:number=0;
    size:number=12;
    offer_id:string="";
    sort:string="";
    categories:any=[];
    category_id:string="";
    occasion_id:string="";
    bread_crumb_text:string="";
    color_id:string="";
    filter_list:any=[];
    product_list:any=[];
    selected_colors:any=[];
    selected_occasions:any=[];
    sort_list:any=[];
    product_count:number=0; 
    showSlider:boolean=false;
    min_price:number=0;
    max_price:number=100000000;
    min:number=0;
    max:number=1000;
    options: Options = {
        floor: 0,
        ceil: 1000,
        minLimit: 0,
        maxLimit: 1000,
        // rightToLeft:true
    };
    LANG:any;
    subscriptions:Subscription[]=[];
    productloaded:boolean=false;


    constructor(@Inject(DOCUMENT) private document: Document,private productService:ProductService,private route:ActivatedRoute,private shared:SharedService,private router:Router,private cartService:CartService,private toast:ToastrManager){
      this.subscriptions.push(this.shared.currentUserStatus.subscribe(user=>this.logged_in=user));      
      this.subscriptions.push(this.shared.countryChanged.subscribe((country_id:string) => {
        // this.getFilters();
        this.getProductList()
        this.resetData();
      }))  
      this.activeIds = ['panel-1', 'panel-2','panel-3','panel-4'];
      this.subscriptions.push(this.route.queryParams
          .subscribe(
              (params: Params) => {
                this.resetData();
                if(params['category_id']){
                  this.category_id = atob(atob(params['category_id']));
                }
                if(params['occasion_id']){
                  this.occasion_id = atob(atob(params['occasion_id']));
                  this.selected_occasions.push({id:this.occasion_id})
                }
                // this.getFilters();
                this.getProductList()
              }
              
        ))
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
          this.changeLanguage();

          // this.getFilters();
          this.getProductList()
        }))
        if(localStorage.getItem('logged_in') != undefined){
          this.logged_in=true;
          this.shared.changeUserStatus(true); 
        }
    }


    ngOnInit(){
      this.changeLanguage();
    }

    changeLanguage(){
      if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
          // this.LANG=environment.arabic_translations;
          this.setBreadCrumb();
          this.setSorting();
          return
      }
      this.LANG=environment.english_translations;
      this.setBreadCrumb();
      this.setSorting();
    }

    setSorting(){
      this.sort_list=[
        {"id":1,"title":this.LANG.Latest},
        {"id":2,"title":this.LANG.Recommended},
        {"id":4,"title":this.LANG.Low_price},
        {"id":3,"title":this.LANG.High_price},
        {"id":5,"title":this.LANG.Popularity}
      ]
      // const sort=this.sort;
      // this.sort=sort;
    }

    setBreadCrumb(){
      if(this.category_id && this.product_list.length > 0){
        this.bread_crumb_text=this.product_list[0].category;
        return
      }
      this.bread_crumb_text=this.LANG.Products
    }

    resetData(){
        this.category_id="";
        this.occasion_id="";
        this.selected_occasions=[];
        this.selected_colors=[];
        this.sort="";
        this.index=0;
        this.min_price=0;
        this.max_price=100000000;
    }

    filtersLists(){
        this.show_mobile_filter=!this.show_mobile_filter
    }

    getFilters(){
        this.subscriptions.push(this.productService.getFilter(this.category_id).subscribe((result:any)=>{
          if(result.status){
            this.filter_list=result.response;
            this.sort=result.response.sort_by.toString();
            this.min_price=parseInt(result.response.min_price) || 0;
            this.max_price=parseInt(result.response.max_price) || 5000;
            this.min=parseInt(result.response.min_price) || 0;
            this.max=parseInt(result.response.max_price) || 5000;
            this.options.floor=parseInt(result.response.min_price) || 0;
            this.options.ceil=parseInt(result.response.max_price) || 5000;
            this.options.minLimit=parseInt(result.response.min_price) || 0;
            this.options.maxLimit=parseInt(result.response.max_price) || 5000;
            this.showSlider=true;
            if(this.filter_list?.color?.length > 0){
              this.filter_list.color.show = 5;
              if(this.filter_list.color.length > 5){
                this.filter_list.color.remaining = this.filter_list.color.length - this.filter_list.color.show;
              }else{
                this.filter_list.color.remaining=0;
              }
            }
            this.getProductList();
          }
        }))
    }

    getProductList(load_more?:boolean){
      console.log(this.category_id);

      const data={
          "index": this.index.toString(),
          "size": this.size.toString(),
          "occasions_id": this.arrayToString(this.selected_occasions), 
          "category_id": this.category_id,
          "color_id": this.arrayToString(this.selected_colors),
          "sort_by": this.sort,
          "min_price":this.min_price.toString(),
          "max_price":this.max_price.toString(),
      }
      this.subscriptions.push(this.productService.getProducts(data).subscribe((result:any)=>{
        if(result.status){
          if(load_more){
              this.load=false;
              this.product_list=[...this.product_list,...result.response];
              this.product_count=parseInt(result.count);
              this.productloaded =false;
              return
          }
          this.product_list=result.response || [];
          this.product_count=parseInt(result.count);
          if(this.category_id && this.product_list.length > 0){
              this.bread_crumb_text=this.product_list[0].category;
          }
        }
        this.products_loaded=true;
      }))
    }

    showMoreFilters(){
      this.filter_list.color.show=this.filter_list.color.length;
      this.filter_list.color.remaining=this.filter_list.color.show - this.filter_list.color.length;
      this.filter_list.color.show_less=true;
    }

    showLess(){
      this.filter_list.color.show=5
      this.filter_list.color.remaining=this.filter_list.color.length - this.filter_list.color.show;
      this.filter_list.color.show_less=false;      
    }

    sortProducts(sort:string){
      if(this.sort == sort){
        return
      }
      this.sort=sort;
      this.getProductList();
    }

    selectOccasions(data:any){
      const index=this.selected_occasions.findIndex((item:any)=>item.id == data.id);
      this.index=0;
      if(index == -1){
          data.isChecked=true;
          this.selected_occasions.push(data);
          this.getProductList();
          return
      }
      data.isChecked=false;
      this.selected_occasions.splice(index,1);
      this.getProductList();
    }

    selectColor(data:any){
      const index=this.selected_colors.findIndex((item:any)=>item.id == data.id);
      this.index=0;
      if(index == -1){
          data.isChecked=true;
          this.selected_colors.push(data);
          this.getProductList();
          return
      }
      data.isChecked=false;
      this.selected_colors.splice(index,1);
      this.getProductList();
    }
    
    valueChanged(event:any){
      this.index = 0
        this.getProductList()
        window.scroll(0,0);
    }

    arrayToString(arr:[]){
        return arr.map((item:any) => { return item.id }).join(',')
    }

    goToProductDetails(product_id:string){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product_id))}})
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
    guestLoginUser:any = false
    guestLogin(data:any,type?:number){
      if(!this.logged_in){
        this.guestLoginUser = true
        this.productService.guestLogin().subscribe((res:any)=>{
          localStorage.clear()
          localStorage.setItem("logged_in", btoa("1"));
          localStorage.setItem("token", res.response.token); 
          this.logged_in= true
          localStorage.setItem("guest_login",this.guestLoginUser)
          this.addToCart(data)
          return
        })
  
      }
      else if(this.logged_in){
        this.addToCart(data)
      }
    }

    addToCart(data:any){
      if(data.stock == "2"){
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
              this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
              return
          }
          data.load=false;
          this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000})
          
      }))
    }


    @HostListener('window:scroll')
      checkScroll() {
        this.infinite();                
      }

      infinite(){
        let selector=this.document.getElementById('abcde');
        let contentHeigth=selector?.offsetHeight || 0;
        let yOffset=window.pageYOffset;
        let y=yOffset + window.innerHeight;
        if(y >= (contentHeigth) && this.productloaded == false && (this.product_count > this.product_list.length)){
            this.productloaded=true;
            this.loadMore();
        }
      }

      loadMore(){
        this.load=true;
        this.index=this.index + 1
        this.getProductList(true)
      }
      
     
         filtersec(){
        	$(".pop").toggleClass("show");	
        }

      



} 