import { Component,OnInit,HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../Services/shared.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { HeaderService } from '../../Services/header.service';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.css']
})

export class FooterComponent implements OnInit {
    footer_data:any={};
    LANG:any;
    show_whatsapp:boolean=false;
    subscriptions:Subscription[]=[];
 

    constructor(private shared:SharedService,private router:Router, public headerService:HeaderService){
        this.subscriptions.push(this.shared.currentFooterData.subscribe((data:any) => {
            this.footer_data=data; 
            console.log(this.footer_data);
                   
        }))
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
        }))
    } 
    

    ngOnInit(){
        this.changeLanguage()
        // this.menu()
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
        }
        else {
            this.LANG=environment.english_translations;
        }
    }

menulist:any
    menu(){
        this.headerService.getMenu().subscribe((res:any)=>{
            this.menulist= res.response
        })
    }
      
    goToproductList(data:any,type?:number){
        
          localStorage.setItem('category_name',data.title)
          this.router.navigate(['/products'],{ queryParams: { category_id: btoa(btoa(data.id))}});
          return
        
      }


    openWhatsApp(){
        let url;
        if(window.innerWidth < 768){
            url="https://wa.me/"+this.footer_data?.utility?.contact_number;               
        }else{
            url="https://web.whatsapp.com/send?phone="+this.footer_data?.utility?.contact_number;
        }
        console.log(url)
        window.open(url,"whatsapp");
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      if(window.scrollY >= 250 ){
        this.show_whatsapp=true;
        return
      }
      this.show_whatsapp=false;
    }


} 