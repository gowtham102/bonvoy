import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { environment } from "src/environments/environment";




@Component({
    templateUrl: './orderList.html',
    styleUrls: ['./orderList.css']

})

 


export class OrderListComponent implements OnInit {
    index:string="0";
    size:string="5";
    order_list:any=[];
    order_count:number=0;
    orders_loaded:boolean=false;
    load:boolean=false;
    LANG:any;
    subscriptions:Subscription[]=[];
    
    constructor(private shared:SharedService,private orderService:OrderService,private router:Router){
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getOrderList();
        }))
    }


    ngOnInit(){
        this.getOrderList();
        this.changeLanguage()
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    getOrderList(load_more?:boolean){
        this.orderService.orderList(this.index,this.size).subscribe((result:any)=>{
            if(result.status){
                if(load_more){
                    result.response.map((data:any)=>{
                        data.ordered_date=this.formatDate(data.created_on);
                    })
                    this.load=false;
                    this.order_list=[...this.order_list,...result.response];
                    this.order_count=parseInt(result.count);
                    return
                }
                this.order_list=result.response;
                this.order_list.map((data:any)=>{
                    data.ordered_date=this.formatDate(data.created_on);
                })
                this.order_count=parseInt(result.count);
                this.orders_loaded=true
            }
        })

    }

    goToOrderDetails(order_id:string){
        this.router.navigate(['/my-profile/order-details'],{ queryParams: { order_id: btoa(btoa(order_id))}})
    }


    goToproductDetails(product:any){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product.product_id))}})
    }

    loadMore(){
        this.load=true;
        this.index=this.index + 1
        this.getOrderList(true)
    }


    formatDate(value:any){
        const date=value.split(" ")[0]
        const day=date.split("-")[2]
        const month=date.split("-")[1]
        const year=date.split("-")[0]
        return `${this.getMonth(month)} ${day},${year}`
    }

    getMonth(index:number){
        const months = ["January","February","March","April","May",
        "June","July","August", "September","October","November","December"];
        return months[index-1]
    }
    
   

      



} 