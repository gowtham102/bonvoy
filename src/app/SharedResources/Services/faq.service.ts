import { Injectable } from '@angular/core';
import { apiServiceComponent } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  public url:any
  constructor(public api:apiServiceComponent) { }

  faqList(){
    this.url= "faq"
    return this.api.get(this.url,"")
  }
}
