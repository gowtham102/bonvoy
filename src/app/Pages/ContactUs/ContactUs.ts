import { Component,OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderService } from 'src/app/SharedResources/Services/header.service';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { environment } from "src/environments/environment";
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';




@Component({
    templateUrl: './ContactUs.html',
    styleUrls: ['./ContactUs.css']

})




export class ContactUsComponent implements OnInit {
    LANG:any;
    err:boolean=false;
    load:boolean=false;
    full_name:string="";
    // email_id:string="";
    mobile_number:string="";
    maxLength:number=10;
    message:string="";
    form_error:any={};
    footer_data:any=[];
    subscriptions:Subscription[]=[];


    constructor(private shared:SharedService,private contact:HeaderService,private toast:ToastrManager,private router:Router){
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

    errorHandler(){
        this.resetFormError();
        if(this.full_name == "" || this.full_name == undefined){
            this.form_error.full_name=true;
            this.err=true
        }
        // if(this.email_id == "" || this.email_id == undefined){
        //     this.form_error.email_id=true;
        //     this.err=true
        // }
        // if(this.email_id && this.checkEmail(this.email_id)){
        //     this.form_error.email_id_valid=true;
        //     this.err=true;
        // }
        if(this.message == "" || this.message == undefined){
            this.form_error.message=true;
            this.err=true
        }
        this.mobileNumberValidation();
    }

    // checkEmail(email:string){
    //     const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return !re.test(email)
    // }

    onlyNumbers(event:any){
        var keycode = (event.which) ? event.which : event.keyCode;
        if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
           event.preventDefault();
           return false;
        } 
        return   
    }
  
    restrictAlphabets(e:any) {
        if (e.type == "paste") {
            var clipboardData = e.clipboardData;
            const mobile_number=clipboardData.getData('Text').split("+").join("").split(" ").join("");
            if (isNaN(mobile_number)) {
                e.preventDefault();
            } else {
                e.clipboardData.setData('text/plain', mobile_number);
                e.preventDefault();
                this.mobile_number=mobile_number.substring(0,13);
                return;
            }
        }


        var x = e.which || e.keycode;
        if ((x >= 48 && x <= 57))
            return true;
        else
            return false;
    } 

    mobileNumberValidation(){
        if(this.mobile_number == "" || this.mobile_number == undefined){
            this.form_error.mobile_number=true;
            this.err=true;
        }
        var re1 = new RegExp(/^([0]{1}[5]{1}[0-9]{8})$/);
        var re2 = new RegExp(/^([5]{1}[0-9]{8})$/);
        var re3 = new RegExp(/^([0]{2}[5]{1}[0-9]{8})$/);
        var re4 = new RegExp(/^([6-9]{1}[0-9]{9})$/);
        var re5 = new RegExp(/^([9]{1}[6]{2}[0-9]{9,})$/);
        var finalRe = new RegExp(re1.source + "|" + re2.source + "|" + re3.source + "|" + re4.source + "|" + re5.source);
        if(!this.form_error.mobile_number && !finalRe.test(this.mobile_number)){
            this.form_error.mobile_number_valid=true;
            this.err=true;
        }
    }

    changeMaxLength(){
        const value=this.mobile_number.substring(0,2);
        if(value == "00"){
            this.maxLength=11;
            return
        }
        this.maxLength=10;
    }

    resetFormError(){
        this.err=false;
        this.form_error={
            "full_name":false,
            // "email_id":false,
            // "email_id_valid":false,
            "message":false,
            "mobile_number":false,
            "mobile_number_valid":false,
        }
    }

    submitFormData(){
        this.errorHandler();
        if(this.err) return;
        this.load=true;
        const data={
            "full_name": this.full_name,
            "mobile_number": this.mobile_number,
            "message": this.message
        }
        this.subscriptions.push(this.contact.contact(data).subscribe((result:any)=>{
        this.load=false;
            if(result.status){
                this.toast.successToastr(result.response.message,"",{position:'top-right',toastTimeout:3000});
                this.router.navigate(["/"])
                return
            }
            this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000});
        }))
    }
    
   

      



} 