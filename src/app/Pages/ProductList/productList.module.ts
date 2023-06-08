import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from '@angular-slider/ngx-slider';



import { ProductListComponent } from './productList';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';






const ChildRoutes: Routes = [
  {
    path: 'products',
    component:ProductListComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    NgbModule,
    NgxSliderModule,
    LoaderModule
  ],
  declarations:[
    ProductListComponent,
  ]
})
export class productListModule { }
