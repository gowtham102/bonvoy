import {Injectable} from '@angular/core';
import * as md5 from 'md5'

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class LoginService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }

    encryptPassword(password : any ){
		return md5(password);
	}



    register(data:Object){
        this.url = "registration";
		return this.api.post(this.url, data);
    }

    checkMobile(data:Object){
        this.url="check_mobile";
        return this.api.post(this.url, data);
    }

    userLogin(data:Object){
        this.url = "login";
		return this.api.post(this.url, data);
    }

    logout(){
        this.url = "logout";
        let query=""
		return this.api.post(this.url, query);   
    }

    search(data:Object){
        this.url = "search";
		return this.api.post(this.url, data);   
    }

    loginWithOtp(data:object){
        this.url = "login_verify_otp";
		return this.api.post(this.url, data);
    }

    sendOtp(data:object){
        this.url = "send_otp";
		return this.api.post(this.url, data);
    }

    verifyOtp(data:object){
        this.url = "verify_otp";
		return this.api.post(this.url, data);
    }

   

    

    
}