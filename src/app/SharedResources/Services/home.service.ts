import {Injectable} from '@angular/core';

import {apiServiceComponent} from '../Services/api.service';




@Injectable({providedIn: 'root'})
export class HomeService{
    private url : string = "";

	constructor(private api : apiServiceComponent){
    }


    getHomePage(){
        this.url="home_page";
        let query="";
		return this.api.get(this.url, query);
    }

    designerList(designer_id?:string){
        let query=""
        this.url="designers";
        if(designer_id){
            console.log(designer_id)
            query="?designer_id="+designer_id;
        }
		return this.api.get(this.url, query);
    }

    

   

    

    
}