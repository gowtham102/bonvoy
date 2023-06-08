import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CartComponent } from './cart';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';











const ChildRoutes: Routes = [
  {
    path: 'my-cart',
    component:CartComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    LoaderModule
  ],
  declarations:[
    CartComponent,
  ]
})
export class cartModule { }
