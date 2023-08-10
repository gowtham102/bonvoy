import {Injectable} from '@angular/core';

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class ProfileService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }


    getProfile(data?:Object){
        this.url="get_profile";
        if(data){
            return this.api.post(this.url, data);
        }
        let query="";
        return this.api.get(this.url, query);
    }


    changePasswrod(data:Object){
        this.url="change_password";
        return this.api.post(this.url, data);
    }


    getAddressList(type?:number,id?:string){
        let query="";
        this.url="user_address_list";
        if(type == 1){
            query="?type="+type;
        }
        if(id){
            query="?type="+type+"&id="+id;
        }
        return this.api.get(this.url, query);
    }

    countryList(){
        this.url="country_list.php"
        return this.api.get(this.url,"")
    }


    addAddress(data:Object){
        this.url="user_address";
        return this.api.post(this.url, data);
    }

    getWalletHistory(){
        this.url="wallet_history";
        return this.api.get(this.url, "");
    }

    

   

    

    
}