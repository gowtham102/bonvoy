import { Component,OnInit, ViewChild, NgZone ,Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { Subscription, timer } from 'rxjs';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { MapsAPILoader } from '@agm/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from "src/environments/environment";
import { address_data } from 'src/app/SharedResources/Models/address.model';
import { ProfileService } from 'src/app/SharedResources/Services/profile.service';
import { errorHandlerService } from 'src/app/SharedResources/Services/errorHandler.service';
import { DOCUMENT } from '@angular/common';




@Component({
    templateUrl: './address.html',
    styleUrls: ['./address.css']

})

 


export class AddressComponent implements OnInit {
    address_clicked:boolean=true;
    latitude = 28.644800;
    longitude = 77.216721;
    icon: string="assets/images/bonvoy/bonvoy_pin.png";
    modalReference:any;
    order_timings:any=[];
    order_time:string="";
    address_list:any=[];
    load: boolean = false;
    err: boolean = false;
    country_id: string="";
    type: number=1;
    country_loaded:boolean=false;
    country_list:any=[];
    address_id: string="";
    full_name: string="";
    email_id: string="";
    mobile_number: string=""; 
    country_code: string="+91";
    default_address:string="1";
    address_type:string="1";
    address: string="";
    lat: any;
    long: any;
    geoCoder: any;
    address_error:any={};
    edit_address_details:any={};
    user_data:any={};
    LANG:any;
    arabic: boolean = false;

    subscriptions:Subscription[]=[];


    @ViewChild('address_modal') address_modal: any;


    constructor(@Inject(DOCUMENT) private document: Document,private modalService: NgbModal,private orderService:OrderService,private shared:SharedService,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private toast:ToastrManager,private profileService:ProfileService,private error:errorHandlerService){
        this.subscriptions.push(this.shared.currentCountryList.subscribe((data:any)=>this.country_list=data));   
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
        if(localStorage.getItem('country_id') != undefined){
            this.country_id=atob(atob(localStorage.getItem('country_id') || "")) ;
        }   
        const user_info=btoa(btoa("user_info"));
        if(localStorage.getItem(user_info) != undefined){
            this.user_data=JSON.parse(decodeURIComponent(escape(atob(atob(localStorage.getItem(user_info) || "")))));            
        }        
    }


    ngOnInit(){
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
        if(type){
            this.clearData();
        }
        this.modalReference=this.modalService.open(content,{ centered: true , windowClass: 'add-address-modal' });
        const time=timer(500);
        this.subscriptions.push(time.subscribe(()=>{
            this.getAutoComplete()
            if(type){
                this.full_name=this.user_data.full_name || "";
                this.mobile_number=this.user_data.mobile_number || "";
                this.country_code=this.user_data.country_code || "";
                this.email_id=this.user_data.email_id || "";
            }
        }))
        this.resetError();
    }

    //Get Address List

    getAddressList(){
        this.subscriptions.push(this.profileService.getAddressList().subscribe((result:any)=>{
            if(result.status){
                this.address_list=result.response;
                this.country_loaded=true;
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
                
                return
            }
            this.country_loaded=true;
        }))
    }


    // Add Address

    getAutoComplete() {
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            const input= this.document.getElementById("search_field") as HTMLInputElement;
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

    editAddress(data:any){
        this.full_name=data.full_name;
        this.email_id=data.email_id;
        this.address=data.address;
        this.latitude=parseFloat(data.latitude);
        this.lat=parseFloat(data.latitude);
        this.longitude=parseFloat(data.longitude);
        this.long=parseFloat(data.longitude);
        this.mobile_number=data.phone;
        this.country_code=data.country_code;
        this.default_address=data.address_type;
        this.address_id=data.id;
        if(data.type.toLowerCase() == 'home'){
            this.address_type='1';
        }else if(data.type.toLowerCase() == 'office'){
            this.address_type='2'
        }else{
            this.address_type='3'
        }
        this.openLg(this.address_modal);
    }


    addAddress(){
        this.err=false;
        this.resetError();
        this.errorHandler();
        if(!this.err){
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
                "latitude": this.lat,
                "longitude": this.long,
                "type": address_type,
                "phone": this.mobile_number,
                "country_code": this.country_code,
                "email_id": this.email_id,
                "pincode":"",
                "landmark": "",
                "address_type": this.default_address,
                "country_id": this.country_id,
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

    removeAddress(data:address_data,index:number){
        data.action="3";
        data.load=true;
        this.subscriptions.push(this.profileService.addAddress(data).subscribe((result:any)=>{
            if(result.status){
                this.address_list.splice(index,1);
                this.toast.successToastr(this.LANG.Address_removed_successfully,"",{position:"top-right",toastTimeout:3000});
            }
        }))
    }

    updateUserAddress(data:address_data){
        this.subscriptions.push(this.profileService.addAddress(data).subscribe((result:any) => {
            if(result.status){
                this.toast.successToastr(this.LANG.Address_updated_Successfully,"",{position:'top-right',toastTimeout:3000});
                this.load=false;
                this.getAddressList();
                this.modalService.dismissAll();
                return
            }
            this.load=false
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
        if(this.country_code == "+91"){
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
            if(this.address_error.mobile_number == false && this.mobile_number.length != 10){
                this.address_error.mobile_number_valid=true;
                this.err=true;	
            } 
            return
        }
        if(this.address_error.mobile_number == false && (this.mobile_number.length < 9 || this.mobile_number.length > 10)){
            this.address_error.mobile_number_valid=true;
            this.err=true;	
        }
    }

    changeCountryCode(country_code:string){
        this.country_code=country_code;
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
        var pastedData = clipboardData.getData('Text');
        if (isNaN(pastedData)) {
            e.preventDefault();
        } else {
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
        this.address_id="";
        this.full_name="";
        this.email_id="";
        this.country_code=this.country_list.length > 0 ? this.country_list[0].country_code : "+91";
        this.mobile_number="";
        this.address="";
        this.address_clicked=false;
        this.latitude = 28.644800;
        this.longitude = 77.216721;
        this.lat=null;
        this.long=null;
        this.address_type="1";
        this.resetError();
    }


    useCurrentLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setGeoAddress);
        }else{
            this.toast.warningToastr(this.LANG.we_are_unable_to_fetch_your_location,"",{position:'top-right',toastTimeout:3000})
        }
    }

    setGeoAddress=(event:any)=>{
        this.latitude = event.coords.latitude ;
        this.longitude = event.coords.longitude;
        this.getAddress(event.coords.latitude , event.coords.longitude)
        this.address_clicked = true;
        this.address_error.address=false
    }
    
   

      



} 