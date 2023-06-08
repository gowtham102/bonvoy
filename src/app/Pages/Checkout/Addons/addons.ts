import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/SharedResources/Services/cartWishlist.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";



@Component({
    templateUrl: './addons.html',
    styleUrls: ['./addons.css']

})

 


export class AddonsComponent implements OnInit {
    card_design:any=[];
    addon_categories:any=[];
    addon_list:any=[];
    addon_id:string="";
    addon_category_id:string="";
    cart_design_id:string="";
    cart_design_image:string="";
    to_text:string="";
    from_text:string=""
    message:string="";
    subscriptions:Subscription[]=[];
    LANG:any;

    constructor(private modalService: NgbModal,private cartService:CartService,private shared:SharedService){
        const cart_design=btoa(btoa("card_design"))
        if(localStorage.getItem(cart_design)){
            localStorage.removeItem(cart_design);
        }
        const to_text=btoa(btoa("to_text"))
        if(localStorage.getItem(to_text)){
            localStorage.removeItem(to_text);
        }
        const from_text=btoa(btoa("from_text"))
        if(localStorage.getItem(from_text)){
            localStorage.removeItem(from_text);
        }
        const message=btoa(btoa("message"))
        if(localStorage.getItem(message)){
            localStorage.removeItem(message);
        }
        this.changeLanguage()
    }


    ngOnInit(){
        this.getCardDesignList();
        this.getAddOnList();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }

    openScrollableContent(longContent:any) {
        this.modalService.open(longContent,{ centered: true });
    }
    

    getCardDesignList(){
        this.subscriptions.push(this.cartService.getCardDesignList().subscribe((result:any)=>{
            if(result.status){
                this.card_design=result.response;
                return
            }
        }))
    }

    getAddOnList(){
        this.subscriptions.push(this.cartService.getAddOnList().subscribe((result:any)=>{
            if(result.status){
                this.addon_categories=result.response;
                if(this.addon_categories.category.length > 0){
                    this.addon_list=this.addon_categories.category[0].ad_ons;
                    this.addon_category_id=this.addon_categories.category[0].id;
                }
                return
            }
        }))
    }

    changeAddonsCategoy(data:any){
        if(data.id == this.addon_category_id){
            return
        }
        this.addon_list=data.ad_ons;
        this.addon_category_id=data.id;
    }

    selectAddons(item:any){
        item.load=true;
        const data={
            "product_id":item.id,
            "quantity":"1"
        }
        this.subscriptions.push(this.cartService.addCart(data).subscribe((result:any)=>{
            if(result.status){
                item.active=true;
                this.addon_id=item.id;
                item.load=false;
                this.shared.emitAddons(true);
                return
            }
            item.load=false;
        }))
    }

    selectCard(data:any){
        this.cart_design_id=data.id;
        this.cart_design_image=data.image; 
        localStorage.setItem(btoa(btoa("card_design")),btoa(btoa(data.id)));
    }

    inputChange(type:number){
        if(type == 1){
            localStorage.setItem(btoa(btoa("to_text")),btoa(btoa(this.to_text)));
            return
        }
        if(type == 2){
            localStorage.setItem(btoa(btoa("from_text")),btoa(btoa(this.from_text)));
            return
        }
        localStorage.setItem(btoa(btoa("message")),btoa(btoa(this.message)));
    
    }


   

      



} 