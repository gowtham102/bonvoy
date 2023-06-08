import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';
import { configServiceComponent } from './config.service';



@Injectable({providedIn: 'root'})
export class apiServiceComponent{
	private url : string = "";
	private PAYLOAD_DATA : string = "";
	private authHeader  : any = "";
	private type : any = "GET";
	constructor(private http : HttpClient, private config : configServiceComponent){
		this.url = this.config.getHOST();
	}
	
	getHeaders(url:string){
		this.authHeader = this.config.getAuthHeaders(url);
		let headers = new HttpHeaders({
			'Content-Type':'application/json',
			'Authentication': this.authHeader,
			'Accept-Language':'en',
			'crossDomain': 'true',
			'city_id':'4'
		});
		const token=localStorage.getItem("token")
		if(token){
			headers = headers.set('Token', token);
		}
		// if(localStorage.getItem("country_id")){
		// 	const country_id=atob(atob(localStorage.getItem("country_id") || "0"))
		// 	headers = headers.set('city_id', country_id);
		// }
		if(localStorage.getItem("arabic") == "true") {
			headers = headers.set('Accept-Language', "ar");
		}
		// const language=localStorage.getItem("arabic");
		// if(language=="true"){
		// 	headers=headers.set("Accept-Language",'ar')
		// }
		return headers;
	}

	get(url:string, pagination:string){
		this.type = "GET";
		this.PAYLOAD_DATA = pagination;
		let headers = this.getHeaders(url);
		let _url = this.url + url + pagination;
		return this.http.get(_url, { headers: headers, withCredentials :true})
		.pipe(map((response : Object) => response),
			catchError(this._errorHandler));
	}
	
	post(url:string, data1:any){
		this.type = "POST";
		this.PAYLOAD_DATA = data1;
		let headers = this.getHeaders(url);
		let _url = this.url + url;
		let data = JSON.stringify(data1);
		return this.http.post(_url, data, { headers: headers, withCredentials :true})
		.pipe(map((response : Object) => response),
		catchError(this._errorHandler));
	}

	_errorHandler(error:  Response){
		return throwError(error || "Server Error");
	}
}

