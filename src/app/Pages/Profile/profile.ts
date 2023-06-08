import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { Subscription } from 'rxjs';
import { environment } from "src/environments/environment";




@Component({
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']

})




export class ProfileComponent implements OnInit {
    show_bg:boolean=false;
    user_profile:any={};
    LANG:any;
    subscriptions:Subscription[]=[];
    
    constructor(route: ActivatedRoute,private router: Router,private shared:SharedService) {
      this.subscriptions.push(this.shared.currentUserProfile.subscribe((data:any)=>this.user_profile=data));
      route.url.subscribe(() => {          
          if(route.firstChild!.routeConfig!.path == ""){
              this.show_bg=true;
              return
          }
          this.show_bg=false;
       });
       this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
       }))
    }

    ngOnInit(){
        this.changeLanguage();
    }
    
    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            return
        }
        this.LANG=environment.english_translations;
    }
   

      



} 