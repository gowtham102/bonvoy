import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd  } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

declare let ga: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bonvoy';
  show_header:boolean=true;
  loader:boolean= false

  constructor(private loadingBar: LoadingBarService,public router: Router){
    setTimeout(() => {
      this.loadingBar.start(); 
      this.loader= false   
    }, 3000);  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if(event?.url.split("/")?.[1] == "a"){
          this.show_header=false;
        }else{
          this.show_header=true;
        }
      }

      // if (event instanceof NavigationEnd) {
      //   // ga('set', 'page', event.urlAfterRedirects);
      //   ga('send', 'pageview');
      // }

    });
    this.loader= true
  }


  



}
