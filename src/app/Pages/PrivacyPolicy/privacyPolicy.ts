import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";




@Component({
    templateUrl: './privacyPolicy.html',
    styleUrls: ['./privacyPolicy.css']

})




export class PrivacyPolicyComponent implements OnInit {
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