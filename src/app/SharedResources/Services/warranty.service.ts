import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {

  constructor(public api:apiServiceComponent) { }

  url:string | undefined

  productlist(){
    this.url="product_list?type_all=1"
    return this.api.get(this.url,'')
  }

  distrubuterList(){
    this.url="distrubuter"
    return this.api.get(this.url,'')
  }

  warrantyClaim(data:object){
    this.url = "warranty_registration"
    return this.api.post(this.url,data)
  }

}