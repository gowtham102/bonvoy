import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
// import { ThankyouComponent } from './thankyou/thankyou.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
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
    AboutUsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
