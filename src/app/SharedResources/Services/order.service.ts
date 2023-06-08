import {Injectable} from '@angular/core';

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class OrderService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }

    orderTimings(date:string){
        this.url="order_timings";
        let query="?date="+date;
        return this.api.get(this.url,query);
    }

    orderSubmit(data:Object){
        this.url="order_submit";
        return this.api.post(this.url,data);
    }

    orderList(index:string,size:string){
        this.url="order_list";
        let query=`?index=${index}&size=${size}`
        return this.api.get(this.url,query);
    }

    orderDetails(order_id:string){
        this.url="order_detail";
        let query=`?order_id=${order_id}`
        return this.api.get(this.url,query);
    }

    reviewProduct(data:Object){
        this.url="insert_review";
        return this.api.post(this.url,data);
    }


    cancelOrder(data:Object){
        this.url="update_order_status";
        return this.api.post(this.url,data);
    }
    

   

    

    
}