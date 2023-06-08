import { Component,OnInit, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { environment } from "src/environments/environment";
import { MapsAPILoader } from '@agm/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HeaderService } from 'src/app/SharedResources/Services/header.service';
import { ActivatedRoute, Params, Router } from '@angular/router';




@Component({
    templateUrl: './GuestAddress.html',
    styleUrls: ['./GuestAddress.css']

})




export class GuestAddressComponent implements OnInit {
    LANG:any=environment.english_translations;
    err:boolean=false;
    load:boolean=false;
    address_clicked:boolean=false;
    latitude = 24.774265;
    longitude = 46.738586;
    icon: string="assets/images/icons/map_icon.svg";
    geoCoder: any;
    address_error:any={};
    address: string="";
    lat: any;
    long: any;
    id:string="";
    subscriptions:Subscription[]=[];


    constructor(@Inject(DOCUMENT) private document: Document,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private toast:ToastrManager,private header:HeaderService,private route:ActivatedRoute,private router:Router){
        this.subscriptions.push(this.route.params
            .subscribe(
                (params: Params) => {
                    
                    if(params['id']){
                        this.id = params['id'];
                    }
                }
            ))
    }

    ngOnInit(){
        this.getAutoComplete();
    }

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
        this.address_error.address=false;
        this.address_error.address_valid=false;
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

    clearSelectedAddress(){       
        this.lat=""
        this.long="" 
    }

    errorHandler(){
        this.resetError();
        if (this.address == "" || this.address == undefined) {
            this.address_error.address = true;
            this.err = true;
        }
        if (this.address && (this.lat == "" || this.long == "" || this.lat == undefined || this.long == undefined)) {
            this.address_error.address_valid = true;
            this.err = true;
        }
    }

    resetError(){
        this.err=false;
        this.address_error={
            "address":false,
            "address_valid":false,
        }
    }


    addAddress(){
        this.errorHandler();
        if(this.err) return;
        this.load=true;
        const data={
            "latitude":this.lat,
            "longitude":this.long,
            "address":this.address,
            "id": this.id
            }
        this.subscriptions.push(this.header.guestAddress(data).subscribe((result:any)=>{
            this.load=false;
            if(result.status){
                this.toast.successToastr(result.response.message,"",{position:'top-right',toastTimeout:3000});
                this.router.navigate(["thankyou"])
                return
            }
            this.toast.warningToastr(result.response.message,"",{position:'top-right',toastTimeout:3000});
            // this.router.navigate(["thankyou"])
        }))
    }


    

    
    
   

      



} 