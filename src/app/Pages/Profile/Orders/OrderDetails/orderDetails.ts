import { Component,OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { environment } from "src/environments/environment";
import { SharedService } from 'src/app/SharedResources/Services/shared.service';



@Component({
    templateUrl: './orderDetails.html',
    styleUrls: ['./orderDetails.css']

})

 


export class OrderDetailsComponent implements OnInit {
    order_id:string="";
    order_details:any={};  
    load:boolean=false;
    cancel_loader:boolean=false;
    subscriptions:Subscription[]=[];
    LANG:any;
    
    constructor(private route:ActivatedRoute,private router:Router,private orderService:OrderService,private shared:SharedService){
        this.subscriptions.push(this.route.queryParams
        .subscribe(
            (params: Params) => {
                this.order_id = atob(atob(params['order_id']))
            }
        ))
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getOrderDetails();
        }))
    }


    ngOnInit(){
        this.getOrderDetails();
        this.changeLanguage();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    getOrderDetails(){ 
        this.subscriptions.push(this.orderService.orderDetails(this.order_id).subscribe((result:any)=>{
            if(result.status){
                this.order_details=result.response; 
                this.order_details.ordered_date=this.formatDate(this.order_details.created_on);
            }
        }))
    }

    goToproductDetails(product:any){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product.product_id))}})
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