import { Component, OnInit } from '@angular/core';
import { FaqService } from '../SharedResources/Services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(public faqService:FaqService) { }

  ngOnInit(): void {
    this.faqList()
  }

  faqlistdata:any

  faqList(){
    this.faqService.faqList().subscribe((res:any)=>{
      this.faqlistdata= res.response
    })
  }

}
