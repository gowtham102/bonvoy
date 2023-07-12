import { Component,OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbDate, NgbModal,NgbDateStruct,NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { Subscription, timer } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { MapsAPILoader } from '@agm/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from "src/environments/environment";
import { address_data } from 'src/app/SharedResources/Models/address.model';
import { ProfileService } from 'src/app/SharedResources/Services/profile.service';
import { errorHandlerService } from 'src/app/SharedResources/Services/errorHandler.service';
import { isBuffer } from 'util';
import { log } from 'console';
import { Router } from '@angular/router';
import { order_data } from 'src/app/SharedResources/Models/order.model';





@Component({
    templateUrl: './addressList.html',
    styleUrls: ['./addressList.css']
 
})

 


export class AddressListComponent implements OnInit {
    address_clicked:boolean=true;
    latitude = 28.644800;
    longitude = 77.216721;
    icon: string="assets/images/icons/map_icon.svg";
    modalReference:any;
    order_timings:any=[];
    order_time:string="";
    to_time:string="";
    order_day:number=0;
    address_list:any=[];
    delivery_address_id:any="";
    load: boolean = false;
    err: boolean = false;
    country_id: string="";
    type: number=1;
    country_list:any=[];
    cart_list:any=[]
    address_id: string="";
    full_name: string="";
    email_id: string="";
    mobile_number: string=""; 
    country_code: string="";
    address_type:string="1";
    address: string="";
    lat: any;
    long: any;
    geoCoder: any;
    address_error:any={};
    edit_address_details:any={};
    user_data:any={};
    today:Date=new Date();
    tomorrow:any=new Date();
    day_after:any;
    LANG:any;
    arabic: boolean = false;
    model!: NgbDateStruct;
    to_text:string="";
    from_text:string=""
    message:string="";
    reciever_number:string="";
    reciever_address:string="";
    reciever_details_error:any={};
    minDate:any=undefined;
    maxLength:number=10;
    date_availability:number=1;
    
    subscriptions:Subscription[]=[];
    markDisabled:any=false;
    disabledDate:any;
    disable_both:boolean=false;
    text_right:boolean=false;
    show_payment:boolean=true;
    wallet:any;
    payment_type:number=2;
    payment_mode:number=1;
    terms:boolean=false;
    cart_design_id:string="";
    billing_address_type:boolean = true

    

    @ViewChild('address_modal') address_modal: any;


    constructor(@Inject(DOCUMENT) private document: Document,private modalService: NgbModal,private orderService:OrderService,private shared:SharedService,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private toast:ToastrManager,private profileService:ProfileService,private error:errorHandlerService,private config: NgbDatepickerConfig, public router:Router){

        this.notes= localStorage.getItem('notes')
        this.subscriptions.push(this.shared.currentWalletAmount.subscribe((wallet:any)=>this.wallet=wallet));                
        this.subscriptions.push(this.shared.show_payment.subscribe((status:boolean)=>this.show_payment=status));      
        this.tomorrow=this.tomorrow.setDate(this.tomorrow.getDate() + 1);
        this.minDate = {
            year: this.today.getFullYear(),
            month: this.today.getMonth()+1,
            day: this.today.getDate()
        };
        this.subscriptions.push(this.shared.currentCountryList.subscribe((data:any)=>this.country_list=data));    
        this.subscriptions.push(this.shared.currentCartList.subscribe((data:any)=>{
            this.cart_list=data;
            this.compareDates(data);
        }));            

        this.subscriptions.push(this.shared.currentDetailsStatus.subscribe((data:any)=>this.reciever_details_error=data));            
        this.subscriptions.push(this.shared.currentAddressList.subscribe((data:any) =>this.address_list=data));        
        this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
            this.changeLanguage();
            this.getAddressList();
        }))
        this.subscriptions.push(this.shared.currentUserData.subscribe((data:any)=>{
            this.user_data=data;
            this.full_name=this.user_data.full_name || "";
            this.mobile_number=this.user_data.mobile_number || "";
            this.country_code=this.user_data.country_code || "";
            this.email_id=this.user_data.email_id || "";
        }));        
        // this.day_after=  this.day_after.setDate(this.day_after.getDate() + 2);
        const order_day=btoa(btoa("order_day"))
        if(localStorage.getItem(order_day)){
            localStorage.removeItem(order_day);
        }
        const order_time=btoa(btoa("order_time"))
        if(localStorage.getItem(order_time)){
            localStorage.removeItem(order_time);
        }
        const to_time=btoa(btoa("to_time"))
        if(localStorage.getItem(to_time)){
            localStorage.removeItem(to_time);
        }
        // const to_text=btoa(btoa("to_text"))
        // if(localStorage.getItem(to_text)){
        //     localStorage.removeItem(to_text);
        // }
        // const from_text=btoa(btoa("from_text"))
        // if(localStorage.getItem(from_text)){
        //     localStorage.removeItem(from_text);
        // }
        // const message=btoa(btoa("message"))
        // if(localStorage.getItem(message)){
        //     localStorage.removeItem(message);
        // }
        // const reciever_number=btoa(btoa("reciever_number"))
        // if(localStorage.getItem(reciever_number)){
        //     localStorage.removeItem(reciever_number);
        // }


        // ====NewCode==========

        const cart_design=btoa(btoa("card_design"));
        if(localStorage.getItem(cart_design)){
            this.cart_design_id=atob(atob(localStorage.getItem(cart_design) || ""));
        }

        const to_text=btoa(btoa("to_text"))
        if(localStorage.getItem(to_text)){
            this.to_text=decodeURIComponent(escape(atob(atob(localStorage.getItem(to_text) || ""))));
        }
        const from_text=btoa(btoa("from_text"))
        if(localStorage.getItem(from_text)){
            this.from_text=decodeURIComponent(escape(atob(atob(localStorage.getItem(from_text) || ""))));
        }
        const message=btoa(btoa("message"))
        if(localStorage.getItem(message)){
            this.message=decodeURIComponent(escape(atob(atob(localStorage.getItem(message) || ""))));
        }
        if(localStorage.getItem(message) || localStorage.getItem(from_text) || localStorage.getItem(to_text)){
            this.onMessageChange();
        }
        const reciever_number=btoa(btoa("reciever_number"))
        if(localStorage.getItem(reciever_number)){
            this.reciever_number=atob(atob(localStorage.getItem(reciever_number) || ""));
        }


        // ==========ends=============




        const reciever_address=btoa(btoa("reciever_address"))
        if(localStorage.getItem(reciever_address)){
            localStorage.removeItem(reciever_address);
        }
        // const delivery_address_id=btoa(btoa("delivery_address_id"))
        // if(localStorage.getItem(delivery_address_id)){
        //     localStorage.removeItem(delivery_address_id);
        // }
        if(localStorage.getItem('country_id') != undefined){
            this.country_id=atob(atob(localStorage.getItem('country_id') || "")) ;
        }
        const user_info=btoa(btoa("user_info"));
        if(localStorage.getItem(user_info) != undefined){
            this.user_data=JSON.parse(decodeURIComponent(escape(atob(atob(localStorage.getItem(user_info) || "")))));
        } 

        const order_date=btoa(btoa("order_day"))
        if(localStorage.getItem(order_day)){
            this.order_date=atob(atob(localStorage.getItem(order_day) || ""));
        }

        
        

    }

    order_date:any
    notes:any


    ngOnInit(){
        this.getOrderTimings("");
        this.getAddressList();
        this.changeLanguage();
    }

    changeLanguage(){
        if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
            // this.LANG=environment.arabic_translations;
            this.arabic=true;
            return
        }
        this.LANG=environment.english_translations;
        this.arabic=false;
    }
    

    openLg(content:any,type?:number) {
        this.clearData();
        this.modalReference=this.modalService.open(content,{ centered: true , windowClass: 'add-address-modal' });
        const time=timer(500);
        this.subscriptions.push(time.subscribe(()=>{
            this.getAutoComplete()
            if(type == 1){
                this.full_name=this.user_data.full_name || "";
                this.mobile_number=this.user_data.mobile_number || "";
                this.country_code=this.user_data.country_code || "";
                this.email_id=this.user_data.email_id || "";
            }
        }))
    }
    
    getOrderTimings(date:string){
        this.subscriptions.push(this.orderService.orderTimings(date).subscribe((result:any)=>{
            if(result.status){
                this.order_timings=result.response?.date;
                const unavailable:string=result.response?.close_date.toString();
                if(this.formatDate(this.today,1).toString() == unavailable){
                    this.date_availability=2;
                }
                if(this.formatDate(new Date(this.tomorrow),1).toString() == unavailable){
                    this.date_availability=3;
                }
                // this.date_availability=parseInt(result.response?.today);
                // if(this.date_availability == 2){
                //     this.minDate.day=this.today.getDate()+1
                // }
                const close_date=unavailable.split("-");
                this.disabledDate={ year: parseInt(close_date[0]), month: parseInt(close_date[1]), day: parseInt(close_date[2])};
                this.markDisabled = (date: NgbDateStruct) => {
                    return (new NgbDate(this.disabledDate.year, this.disabledDate.month, this.disabledDate.day).equals(date))
                      ? true
                      : false;
                };      
                return
            }
        }))
    }

    selectOrderTime(data:any){
        if((data.available == 0 && this.order_day == 1) || this.order_day == 0){
            return
        }
        this.order_time=data.time;
        this.to_time=data.to_time;
        localStorage.setItem(btoa(btoa("order_time")),btoa(btoa(this.order_time)));
        localStorage.setItem(btoa(btoa("to_time")),btoa(btoa(this.to_time)));
    }

    selectOrderDay(type:number){
        if(type == 1 && this.date_availability == 2){
            return
        }
        if(type == 2 && this.date_availability == 3){
            return
        }
        if(this.disable_both){
            return
        }
        this.order_day=type;
        const timings=this.order_timings;
        this.order_timings=[];
        this.order_timings=timings;
        this.order_time="";
        this.to_time="";
        this.day_after="";
        const order_time=btoa(btoa("order_time"))
        if(localStorage.getItem(order_time)){
            localStorage.removeItem(order_time)
        }
        const to_time=btoa(btoa("to_time"))
        if(localStorage.getItem(to_time)){
            localStorage.removeItem(to_time)
        }
        if(this.order_day == 1){
            const day=this.today.toLocaleDateString('en-CA')
            localStorage.setItem(btoa(btoa("order_day")),btoa(btoa(day)));
            this.getOrderTimings(day);
            return
        }
        if(this.order_day == 2){
            localStorage.setItem(btoa(btoa("order_day")),btoa(btoa(this.formatDate(new Date(this.tomorrow),1))));
            this.getOrderTimings(this.formatDate(new Date(this.tomorrow),1));
            return
        }
        localStorage.setItem(btoa(btoa("order_day")),btoa(btoa(this.formatDate(new Date(this.day_after)))));
        this.getOrderTimings(this.formatDate(new Date(this.day_after),1));

    }


    formatDate(value:any,type?:number){
        if(type == 1){
            return `${value.getFullYear()}-${("0" + (value.getMonth() + 1)).slice(-2)}-${("0" + value.getDate()).slice(-2)}`
        }
        return `${value.getFullYear()}/${value.getMonth()+1}/${value.getDate()}`
    }

    //Get Address List

    // locationReload:boolean=false
    getAddressList(){
        this.subscriptions.push(this.profileService.getAddressList().subscribe((result:any)=>{
            // if (!localStorage.getItem('foo')) { 
            //     localStorage.setItem('foo', 'no reload') 
            //     location.reload() 
            //   } else {
            //     localStorage.removeItem('foo') 
            //     this.locationReload=true
            //   }
            if(result.response.length==0){
                this.openLg(this.address_modal,1)
            }
            if(result.status){
               
                this.address_list=result.response;
               
                this.shared.changeAddressList(result.response)
                this.address_list.map((data:any)=>{
                    data.address_type_class=data.address_type;
                    if(data.type.toLowerCase() == 'home'){
                        data.type_class='home';
                    }else if(data.type.toLowerCase() == 'office'){
                        data.type_class='office'
                    }else{
                        data.type_class='other'
                    }
                });
                // if(this.address_list.length === 0){
                //     const time=timer(500)
                //     this.subscriptions.push(time.subscribe(()=>{
                //         this.openLg(this.address_modal,1);
                //     }))
                // }
            }
        }))
    }


    send_address_id(event:any){
        localStorage.setItem(btoa(btoa("delivery_address_id")),btoa(btoa(event)));
        console.log(event);
        
    }

    changeSelectedAddress(data:address_data){
        if(data.id == this.delivery_address_id){
            return
        }
        this.delivery_address_id=data.id || "";
        localStorage.setItem(btoa(btoa("delivery_address_id")),btoa(btoa(this.delivery_address_id)));


        // if(data.address_type == "1"){
        //     return
        // }
        // data.address_type="1";
        // data.action="2";
        // data.load=true;
        // this.updateUserAddress(data,1)
    }


    // Add Address

    getAutoComplete() {
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            var input = this.document.getElementById('search_field') as HTMLInputElement;
            let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.lat = place.geometry.location.lat();
                    this.long = place.geometry.location.lng();
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.address = place.formatted_address!;
                    this.address_error.address=false;
                    this.address_clicked = true;
                    // this.zoom=18
                });
            });
        });
    }


    onSelectAddress(event:any) {
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;
        this.getAddress(event.coords.lat, event.coords.lng);
        this.address_clicked = true;
        this.address_error.address=false
    }

    changeAddressType(address_type:string){
        if(this.address_type == address_type){
            return
        }
        this.address_type=address_type
    }

    getAddress(latitude:any, longitude:any) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:string) => {
            if (status == 'OK') {
                if (results[0]) {
                    this.lat = latitude;
                    this.long = longitude;
                    this.address = results[0].formatted_address;
                    // this.zoom=18
                } else {
                    this.toast.warningToastr("",this.LANG.No_result_found, { position: "top-right", toastTimeout: 3000 });
                }
            } else {
                this.toast.errorToastr(this.LANG.we_are_unable_to_fetch_your_location, this.LANG.Error, { position: "top-right", toastTimeout: 3000 });
            }
        });
    }


    addAddress(){
        this.err=false;
        this.resetError();
        this.errorHandler();
        if(this.err) return;
        this.load=true;
        let address_type:string;
        if(this.address_type == '1'){
            address_type=this.LANG.Home;
        }else if(this.address_type == '2'){
            address_type=this.LANG.Office;
        }else{
            address_type=this.LANG.Other;
        }
        let data:address_data = {
            "full_name": this.full_name,
            "address": this.address,
            "email_id": this.email_id,
            "latitude": this.lat,
            "longitude": this.long,
            "type": address_type,
            "phone": this.mobile_number,
            "country_code": this.country_code,
            "pincode":"",
            "landmark": "",
            "address_type": "1",
            "country_id": "0",
            "city_id": "",
            "state_id": "",
            "action":"1"
        }
        if(this.address_id){
            data.id=this.address_id;
            data.action="2";
            data.address_type=this.edit_address_details.address_type;
            this.updateUserAddress(data);
            return
        }
        this.saveUserAddress(data)
    }


    saveUserAddress(data:address_data){
        this.subscriptions.push(this.profileService.addAddress(data).subscribe((result:any) => {
            if(result.status){
                if(data.action == "1"){
                    this.load=false;
                    this.toast.successToastr(this.LANG.Address_added_Successfully,"",{position:'top-right',toastTimeout:3000});
                    this.getAddressList();
                    this.modalService.dismissAll();
                    return
                }
            }
            this.load=false
            this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000})
        },(respagesError:any) => {
            this.load=false
            const error = this.error.getError(respagesError);
            if(error == "Gateway timeout"){
                return
              }
            this.toast.errorToastr(error,this.LANG.Error,{position:'top-right',toastTimeout:3000})
        }))
    }

    updateUserAddress(data:address_data,type?:number){
        this.subscriptions.push(this.profileService.addAddress(data).subscribe((result:any) => {
            if(result.status){
                data.load=false;
                this.toast.successToastr(this.LANG.Address_updated_Successfully,"",{position:'top-right',toastTimeout:3000});
                this.load=false;
                if(type == 1){
                    this.getAddressList();
                }
                return
            }
            this.load=false;
            data.load=false;
            this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000})
        },respagesError => {
            this.load=false
            const error = this.error.getError(respagesError);
            if(error == "Gateway timeout"){
                return
              }
            this.toast.errorToastr(error,this.LANG.Error,{position:'top-right',toastTimeout:3000})
        }))
    }

    errorHandler(){
        this.mobileErrorHandler();
        if(this.full_name == "" || this.full_name == undefined){
            this.address_error.full_name=true;	
            this.err=true;
        }
        // if(this.email_id == "" || this.email_id == undefined){
        //     this.address_error.email_id=true; 
        //     this.err=true;
        // }
    
        if(this.email_id && this.checkEmail(this.email_id)){
            this.address_error.email_id_valid=true;
            this.err=true;
        }

        // if (this.address == "" || this.address == undefined) {
        //     this.address_error.address = true;
        //     this.err = true;
        // }
        if (this.address && (this.lat == "" || this.long == "" || this.lat == undefined || this.long == undefined)) {
            this.address_error.address_valid = true;
            this.err = true;
        }
    }

    
    checkEmail(email:string){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !re.test(email)
    }
  


    mobileErrorHandler(){
        if(this.mobile_number == ""  || this.mobile_number == undefined){
            this.address_error.mobile_number=true;	
            this.err=true;
        }
        if(this.country_code == "+966"){
            const re=/^([0]{1}[5]{1}[0-9]*)$/
            const re1=/^([5]{1}[0-9]*)$/
    
            if(!this.address_error.mobile_number && !re.test(this.mobile_number) && !re1.test(this.mobile_number)){
            this.address_error.mobile_number_valid=true;	
            this.err=true;
            }
    
            if(!this.address_error.mobile_number && re.test(this.mobile_number) && this.mobile_number.length != 10){
            this.address_error.mobile_number_valid=true;
            this.err=true;	
            }
    
            if(!this.address_error.mobile_number && re1.test(this.mobile_number) && this.mobile_number.length != 9){
            this.address_error.mobile_number_valid=true;
            this.err=true;	
            }
            return
        }
        if(this.country_code == "+91"){
            if(!this.address_error.mobile_number && this.mobile_number.length != 10){
                this.address_error.mobile_number_valid=true;
                this.err=true;	
            } 
            return
        }
        if(!this.address_error.mobile_number && (this.mobile_number.length < 9 || this.mobile_number.length > 10)){
            this.address_error.mobile_number_valid=true;
            this.err=true;	
        }
    }

    changeCountryCode(country_code:string){
        this.country_code=country_code;
        this.biling_code= country_code
        this.address_error.mobile_number_valid=false;
    }

    resetError(){
        this.address_error={
          "mobile_number":false,
          "mobile_number_valid":false,
          "full_name":false,
          "email_id":false,
          "email_id_valid":false,
          "address":false,
          "address_valid":false,
        }
    }

    clearSelectedAddress(){       
        this.lat=""
        this.long=""
    }

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
            this.reciever_number=mobile_number.substring(0,13);
            this.inputChange(5);
            return;
        }
        }


        var x = e.which || e.keycode;
        if ((x >= 48 && x <= 57))
            return true;
        else
            return false;
    } 

    clearData(){
        this.full_name="";
        this.email_id="";
        this.country_code=this.country_list.length > 0 ? this.country_list[0].country_code : "+91";
        this.mobile_number="";
        this.address="";
        this.address_clicked=false;
        this.latitude = 28.644800;
        this.longitude = 	77.216721;
        this.lat=null;
        this.long=null;
        this.address_type="1";
        this.resetError();
    }

    dateChanged(){
        this.day_after=`${this.model.year}/${this.model.month}/${this.model.day}`;
        this.order_day=3;
        localStorage.setItem(btoa(btoa("order_day")),btoa(btoa(this.formatDate(new Date(this.day_after),1))));
        this.getOrderTimings(this.formatDate(new Date(this.day_after),1))
        const order_time=btoa(btoa("order_time"))
        if(localStorage.getItem(order_time)){
            localStorage.removeItem(order_time)
        }
        const to_time=btoa(btoa("to_time"))
        if(localStorage.getItem(to_time)){
            localStorage.removeItem(to_time)
        }
    }

    inputChange(type:number){
        if(type == 1){
            localStorage.setItem(btoa(btoa("to_text")),btoa(btoa(unescape(encodeURIComponent(this.to_text)))));
            return
        }
        if(type == 2){
            localStorage.setItem(btoa(btoa("from_text")),btoa(btoa(unescape(encodeURIComponent(this.from_text)))));
            return
        }
        if(type == 3){
            const post = document.createElement('p');
            post.textContent = this.message;
            post.innerHTML = post.innerHTML.replace(/\n/g, '<br>\n');            
            localStorage.setItem(btoa(btoa("post_message")),btoa(btoa(unescape(encodeURIComponent(post.innerHTML)))));
            localStorage.setItem(btoa(btoa("message")),btoa(btoa(unescape(encodeURIComponent(this.message)))));
            return
        }
        if(type == 4){
            localStorage.setItem(btoa(btoa("reciever_address")),btoa(btoa(unescape(encodeURIComponent(this.reciever_address)))));
            return
        }
        localStorage.setItem(btoa(btoa("reciever_number")),btoa(btoa(this.reciever_number)));
    }

    changeMaxLength(){
        const value=this.reciever_number.substring(0,2);
        if(value == "00"){
            this.maxLength=11;
            return
        }
        this.maxLength=10;
    }
    
    onMessageChange(){
        var arabicAlphabetDigits = /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]|[\u0200]|[\u00A0]/g;
        // var key = String.fromCharCode(event.which);
        if(arabicAlphabetDigits.test(this.message[0]) || arabicAlphabetDigits.test(this.from_text[0]) || arabicAlphabetDigits.test(this.to_text[0])){
            this.text_right=true;
            return
        }
        this.text_right=false;
    }

    // openScrollableContent(content:any) {
    //     this.modalService.open(content,{ centered: true });
    // }


    useCurrentLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setGeoAddress);
        }else{
            this.toast.warningToastr(this.LANG.we_are_unable_to_fetch_your_location,"",{position:'top-right',toastTimeout:3000})
        }
    }

    setGeoAddress=(event:any)=>{
        this.latitude = event?.coords?.latitude;
        this.longitude = event?.coords?.longitude;
        this.getAddress(event.coords.latitude,event.coords.longitude)
        this.address_clicked = true;
        this.address_error.address=false;
    } 


    compareDates(cart_list:any){
        if(cart_list.length > 0){
            var max = this.today.toLocaleDateString('en-CA');
            cart_list.map((data:any)=>{
                if(data.delivery_from){
                    const newDate=data.delivery_from?.split(" ")[0] || "";
                    if (this.fDate(newDate) > this.fDate(max)){
                        max = newDate;
                    }
    
                }
            })
            if(max){
                this.minDate = {
                    year: parseInt(max.split("-")[0]),
                    month: parseInt(max.split("-")[1]),
                    day: parseInt(max.split("-")[2])
                };
            }
            if(new Date(max) > new Date(this.tomorrow) && new Date(max).getTime() !== new Date(this.tomorrow).getTime()){
                this.disable_both=true;
                return
            }
            if(new Date(max) > this.today && new Date(max).getTime() !== new Date(this.formatDate(this.today,1)).getTime()){
                this.date_availability=2;
            }
        }
        // this.getOrderTimings(this.today) 
    }

    fDate(s:any) {
        var d = new Date();
        s = s.split('-');
        d.setFullYear(s[0]);
        d.setMonth(s[1]);
        d.setDate(s[2]);
        return d;
    }


    changePaymentType(payment_type:number,payment_mode?:number){
        if(payment_mode){
            this.payment_mode=payment_mode;
        }
        if(payment_type == this.payment_type){
            return
        }
        this.payment_type=payment_type
    }

    use_wallet:boolean=false;
    billing_name:any
    biling_code:any
    billing_email:any
    billing_number:any
    billing_address:any
    useWallet(){
        this.shared.emitWalletUsed(this.use_wallet)
    }
    
    submitOrder(){
        if(!this.terms){
            this.toast.warningToastr(this.LANG.Please_accept_terms_and_conditions,"",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
            return
        }
        if(this.delivery_address_id== ""){
            this.toast.warningToastr("Please Select the Address","",{position:'top-right',toastTimeout:3000,maxShown:1,newestOnTop:false,animate:'null'});
            return
        }
        this.load=true;
        const data={
            "address_id":this.delivery_address_id,
            "payment_type":this.payment_type.toString(),
            "payment_mode":this.payment_mode.toString(),
            "order_from":"1",
            "wallet":this.use_wallet ? "1":"0",
            "date":this.order_date,
            "time":this.order_time,
            "to_time":this.to_time,
            "card_id":this.cart_design_id,
            "card_to":this.to_text,
            "card_from":this.from_text,
            "card_message":this.message,
            "recievers_number":this.reciever_number,
            "recievers_address":this.reciever_address,
            "notes":this.notes,
            "billing_address":{
                "full_name":this.billing_name,
                "country_code":this.biling_code,
                "email_id":this.billing_email,
                "phone_number":this.billing_number,
                "address":this.billing_address
            }
        }
        this.orderService.orderSubmit(data).subscribe((result:any)=>{
          this.load=false
          if(result.response.status){
              this.clearLocalData();
            if(result.response.url){
                location.href=result.response.url;
                return
            }
            this.toast.successToastr(this.LANG.Order_Placed_successfully,"",{position:'top-right',toastTimeout:3000});
            this.shared.changeCount("0");
            this.router.navigate(['/order-success'])
            return
          }
          this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000})
      })
    }

    openTerms(modalContent:any) {
        this.modalService.open(modalContent,{ centered: true });
    }

    clearLocalData(){
        const order_day=btoa(btoa("order_day"))
        if(localStorage.getItem(order_day)){
            localStorage.removeItem(order_day);
        }
        const order_time=btoa(btoa("order_time"))
        if(localStorage.getItem(order_time)){
            localStorage.removeItem(order_time);
        }
        const to_time=btoa(btoa("to_time"))
        if(localStorage.getItem(to_time)){
            localStorage.removeItem(to_time);
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
        const reciever_number=btoa(btoa("reciever_number"))
        if(localStorage.getItem(reciever_number)){
            localStorage.removeItem(reciever_number);
        }
        const reciever_address=btoa(btoa("reciever_address"))
        if(localStorage.getItem(reciever_address)){
            localStorage.removeItem(reciever_address);
        }
        const delivery_address_id=btoa(btoa("delivery_address_id"))
        if(localStorage.getItem(delivery_address_id)){
            localStorage.removeItem(delivery_address_id);
        }
    }

    onbilladdress(){
        if(this.billing_address_type==false){
            this.billing_address_type= true
            this.billing_address=""
            this.billing_name=""
            this.billing_email=""
            this.billing_number=""
            this.biling_code=""
            return
        }
        if(this.billing_address_type==true){
            this.billing_address_type=false
            return
        }
    }


      



} 