import {Injectable} from '@angular/core';

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class ProductService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }

    getProducts(data:Object){
        this.url="product_list";
        return this.api.post(this.url,data);
    }

    getFilter(category_id:string){
        this.url="filter_list";
        let query="?category_id="+category_id;
        return this.api.get(this.url,query);
    }

    getProductDetails(product_id:string){
        this.url="product_detail";
        let query="?id="+product_id;
        return this.api.get(this.url,query);
    }

    getRelatedProducts(parent_sku:string){
        this.url="related_product";
        let query="?parent_sku="+parent_sku;
        return this.api.get(this.url,query);
    }


    

   

    

    
}