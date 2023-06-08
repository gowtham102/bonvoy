import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";




@Component({
    templateUrl: './wishlist.html',
    styleUrls: ['./wishlist.css']

})

 


export class WishlistComponent implements OnInit {
    wishlist:any=[];
    wishlist_length:number=0;
    index:string="0";
    size:string="10";
    wishlistLoaded:boolean=false;
    wishlist_count:string="";
    subscriptions:Subscription[]=[];
    LANG:any;
    
    constructor(private cartService:CartService,private router:Router,private toast:ToastrManager,private shared:SharedService){
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.getWishlist();
            this.changeLanguage();
        }))
    }


    ngOnInit(){
        this.getWishlist();
        this.changeLanguage();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    

    getWishlist(){
        this.subscriptions.push(this.cartService.getWishlistDetails(this.index,this.size).subscribe((result:any)=>{
            if(result.status){
                this.wishlist=result.response;
                this.wishlistLoaded=true;
                this.wishlist_length=result.response.length;
                return
            }
            this.wishlist_length=0;
            this.wishlistLoaded=true;
        }))
    }

    addToWishlist(data:any,index:number,show_message?:boolean){
        this.subscriptions.push(this.cartService.addWishlist(data.id).subscribe((result:any)=>{
            if(result.status){
              if(result.response.status){
                data.wishlist="1";
                this.toast.successToastr(this.LANG.Product_added_to_wishlist,"",{position:"top-right",toastTimeout:3000});
                return
              }
              data.wishlist="0";              
              this.wishlist.splice(index,1);
              this.wishlist_length -= 1;
              if(show_message){
                this.toast.successToastr(this.LANG.Product_removed_from_wishlist,"",{position:"top-right",toastTimeout:3000}) 
              }
              return
            }
              this.toast.warningToastr(result.response.message,"",{position:"top-right",toastTimeout:3000}) 
        }))
    }

    addToCart(data:any,i:number){
        const post_data={
            "product_id": data.id,
            "user_body_measure_id":"1",
            "quantity":"1"
        }
        this.subscriptions.push(this.cartService.addCart(post_data).subscribe((result:any)=>{
            if(result.status){
                this.shared.changeCount(result.response.extra);
                this.toast.successToastr(this.LANG.Product_added_to_Cart,"",{position:"top-right",toastTimeout:3000});
                this.addToWishlist(data,i)
                this.router.navigate(['/my-cart']);
                return
            }
            this.toast.warningToastr(result.reponse.message,"",{position:"top-right",toastTimeout:3000})
        }))
    }

    goToproductDetails(product:any){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product.id))}})
    }
    
   

      



} 