import {Injectable} from '@angular/core';
import SHA1 from 'sha1';


@Injectable({providedIn: 'root'})
export class configServiceComponent{
	

	HOST : string = "http://35.154.4.154/bonvoy/api/app/v0_1/api/";
	// HOST : string = "https://api.bloss-sa.com/app/v0_1/api/"; 
	

	USERID : string = "	";
	USERNAME : string = "user@quickfix";
	PASSWORD : string = "JpYXQiOjE1OTU1MDc5MT";



	 constructor(){}

	
	getHOST(){
		return this.HOST;
	}

	getAuthHeaders(routeUrl :any){
		let finalAuth = SHA1(this.HOST + routeUrl +"|"+ this.USERNAME +"|"+ this.PASSWORD);
		return finalAuth
	}

	

		
		   

		
	
}