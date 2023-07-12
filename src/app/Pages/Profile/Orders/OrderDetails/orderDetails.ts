import { Component,OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { environment } from "src/environments/environment";
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { ProductService } from 'src/app/SharedResources/Services/product.service';
import { ToastrManager } from 'ng6-toastr-notifications';
declare const $: any;

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
    product_id:string="";
    rating:any
    width:any="10"

    
    constructor(private route:ActivatedRoute,private router:Router,private orderService:OrderService,private shared:SharedService,private toast:ToastrManager, public productService:ProductService){
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
                const status=this.order_details.status_list.filter((data: { created_on: any; })=>{
                    return data.created_on
                })
                this.order_details.ordered_date=this.formatDate(this.order_details.created_on);
                this.width=parseInt(this.width) * status.length
            }
        }))
    }

    goToproductDetails(product:any){
        this.router.navigate(['/product-details'],{ queryParams: { product_id: btoa(btoa(product.product_id))}})
    }
    
order_id_rate:any
    ratemodal(event:any){
        this.order_id_rate= event
        $('#review-modal,.overlay-pop').addClass('show');
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
   
    review:any
    insertRating(){
      if(this.rating!=0){
        let data=  {"order_detail_id":this.order_id_rate,"rating":this.rating,"comment":this.review}
        this.productService.insert_review(data).subscribe((res:any)=>{
          if(res.status==true){
            this.toast.successToastr(res.response.message)
            $('#review-modal').addClass('close');
          }
          if(res.status==false){
            this.toast.warningToastr(res.response.message)
            $('#review-modal').addClass('close');
          }
        })
      }
    
  
    
    }
      

    ordertrack(){
        $(".order-track-row").toggleClass("show")
    }
    closemodal(){
        $("#review-modal,.overlay-pop").removeClass("show");
      }
} 