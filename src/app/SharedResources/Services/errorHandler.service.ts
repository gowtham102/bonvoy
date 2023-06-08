import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class errorHandlerService{
	_error = ""
	constructor(){}
	getError(error :any){
		var error_code = parseInt(JSON.stringify(error.status),10);
		if(error_code == 400 || error_code == 401 || error_code == 403){
			this._error =  "Forbidden Request";
		}
		else if(error_code == 404)
			this._error = "Not Found";
		else if(error_code == 500)
			this._error =  "Internal Server Error";
		else if(error_code == 503 || error_code == 504) { 
			this._error ="Gateway timeout"
		}
		else if(error_code == 0){
			this._error ="Please Check your Internet Connectivity and Try again"
		}
		else {
			this._error =  "Something went wrong!";
		}
		return this._error;
		}
		
	
	
}

