import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ToastrModule } from 'ng6-toastr-notifications';
import {AngularFireStorageModule} from "@angular/fire/storage";



import { HeaderComponent } from './SharedResources/Components/Header/header';
import { FooterComponent } from './SharedResources/Components/Footer/footer';
import { HomeComponent } from './Pages/Home/home';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoaderModule } from './SharedResources/Components/Loader/loader.module';
import { AboutUsModule } from './about-us/about-us.module';
import { Header2Component } from './header2/header2.component';
import { WarrantyComponent } from './warranty/warranty.component';
// import { EwasteComponent } from './ewaste/ewaste.component';
// import { WarrantypolicyComponent } from './warrantypolicy/warrantypolicy.component';
// import { ShippingpolicyComponent } from './shippingpolicy/shippingpolicy.component';
// import { ReplacementpolicyComponent } from './replacementpolicy/replacementpolicy.component'
;
// import { FaqComponent } from './faq/faq.component';
// import { WarrantyModule } from './warranty/warranty.module';
// import { ThankyouComponent } from './thankyou/thankyou.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    Header2Component,
    // EwasteComponent,
    // WarrantypolicyComponent,
    // ShippingpolicyComponent,
    // ReplacementpolicyComponent

    // FaqComponent,
    // WarrantyComponent,
    // ThankyouComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CarouselModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    LoaderModule,
    FormsModule,
    AngularFireStorageModule,
    AboutUsModule,
    NgbRatingModule,
    // WarrantyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
