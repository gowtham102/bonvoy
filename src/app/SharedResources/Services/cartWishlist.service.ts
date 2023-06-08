import {Injectable} from '@angular/core';

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class CartService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }


    addWishlist(product_id?:string){
        this.url="check_wishlist";
        let query=`?product_id=${product_id}`
        return this.api.get(this.url, query);
    }


    addCart(data:any){
        this.url="insert_cart";
        return this.api.post(this.url,data);
    }

    updateCart(data:any){
        this.url="update_cart";
        return this.api.post(this.url,data);
    }

    getCartDetails(){
        this.url="cart";
        let query="";
        return this.api.get(this.url,query);
    }

    getWishlistDetails(index:string,size:string){
        this.url="wishlist";
        let query=`?index=${index}&size=${size}`
        return this.api.get(this.url,query);
    }

    applyCoupon(data:any){
        this.url="coupon_cart";
        return this.api.post(this.url,data);
    }

    getCardDesignList(){
        this.url="card_list";
        let query="";
        return this.api.get(this.url,query);
    }

    getAddOnList(){
        this.url="add_ons_list";
        let query="";
        return this.api.get(this.url,query);
    }

    addAdOns(data:any){
        this.url="add_add_ons";
        return this.api.post(this.url,data);
    }
    
}