import { Component,OnInit } from '@angular/core';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { Subscription } from 'rxjs';
import { environment } from "src/environments/environment";
import { ProfileService } from 'src/app/SharedResources/Services/profile.service';



@Component({
    templateUrl: './wallet.html',
    styleUrls: ['./wallet.css']

})

 


export class WalletComponent implements OnInit {
    walletList:any=[];
    available_amount!:string;
    currency!:string;
    wallet_loaded:boolean=false;
    isCollapsed:boolean = true;
    LANG:any;
    subscriptions:Subscription[]=[];

    
    constructor(private shared:SharedService,private profile:ProfileService){
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getWalletHiistory();
        }))
    }


    ngOnInit(){
        this.getWalletHiistory();
        this.changeLanguage()
    }

    getWalletHiistory(){
        this.subscriptions.push(this.profile.getWalletHistory().subscribe((result:any)=>{
            this.wallet_loaded=true;
            if(result.status){
                result?.response?.history?.map((data:any)=>{
                    data.display_date=this.formatDate(data.created_on);
                })
                this.walletList=result?.response?.history;
                this.available_amount=result?.response?.balance;
                this.currency=result?.response?.currency;
            }
        }))
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
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