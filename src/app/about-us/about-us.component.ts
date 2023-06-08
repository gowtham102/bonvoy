import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  LANG:any

  constructor() { }

  ngOnInit(): void {
    this.changeLanguage()
  }

  changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        // this.LANG=environment.arabic_translations;
        return
    }
    this.LANG=environment.english_translations;
}

}
