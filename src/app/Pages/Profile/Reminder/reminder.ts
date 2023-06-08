import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "src/environments/environment";
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { Subscription } from 'rxjs';




@Component({
    templateUrl: './reminder.html',
    styleUrls: ['./reminder.css']

})

 


export class ReminderComponent implements OnInit {
    LANG:any;
    subscriptions:Subscription[]=[];
    
    constructor(private modalService: NgbModal,private shared:SharedService){
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
    

    openLg(longContent:any) {
        this.modalService.open(longContent,{ centered: true , windowClass: 'reminder-modal' });
    }
   

      



} 