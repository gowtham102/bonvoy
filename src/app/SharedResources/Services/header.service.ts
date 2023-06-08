import {Injectable} from '@angular/core';

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class HeaderService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }


    getMenu(){
        this.url="menu";
        let query="";
		return this.api.get(this.url, query);
    }

    search(data:Object){
        this.url = "search";
		return this.api.post(this.url, data);   
    }

    countryList(){
        this.url = "country_list";
        let query="";
		return this.api.get(this.url, query);  
    }

    updateCountry(id:string){
        this.url = "country_update";
        let query="?id="+id
		return this.api.get(this.url, query);   
    }

    updateCity(id:string){
        this.url = "city_update";
        let query="?id="+id
		return this.api.get(this.url, query);   
    }

    logout(data:Object){
        this.url = "logout";
		return this.api.post(this.url, data);
    }

    contact(data:Object){
        this.url = "contact_us";
		return this.api.post(this.url, data);
    }

    guestAddress(data:Object){
        this.url = "guest_update_address";
		return this.api.post(this.url, data);
    }

    

    

    

   

    

    
}