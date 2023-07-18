import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxImageZoomModule } from 'ngx-image-zoom';

import { ProductDetailsComponent } from './productDetails';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';








const ChildRoutes: Routes = [
  {
    path: 'product-details', 
    component:ProductDetailsComponent
  },
  {
    path: 'product-details/:product_id', 
    component:ProductDetailsComponent
  },
  
  ]
 
@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    CarouselModule,
    LoaderModule,
    NgxImageZoomModule,
    NgbRatingModule
  ],
  declarations:[
    ProductDetailsComponent,
  ],
  providers: [DatePipe]
})
export class productDetailsModule { }
