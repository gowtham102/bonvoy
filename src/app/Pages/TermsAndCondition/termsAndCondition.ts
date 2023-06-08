import { Component,OnInit } from '@angular/core';
import { environment } from "src/environments/environment";
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { Subscription } from 'rxjs';



@Component({
    templateUrl: './termsAndCondition.html',
    styleUrls: ['./termsAndCondition.css']
})

export class TermsConditionComponent implements OnInit { 
    LANG:any;
    subscriptions:Subscription[]=[];
    footer_data:any=[];



    constructor(private shared:SharedService){
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
        }))
        this.subscriptions.push(this.shared.currentFooterData.subscribe((data:any) => {
            this.footer_data=data.utility;
        }))
        this.changeLanguage();
        
    }
    
    ngOnInit(){
        window.scroll(0,0);
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
        }
        else {
            this.LANG=environment.english_translations;
        }
    }


    
      



} 