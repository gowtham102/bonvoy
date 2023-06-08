import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrderSuccessComponent } from './orderSuccess';











const ChildRoutes: Routes = [
  {
    path: 'order-success',
    component:OrderSuccessComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
  ],
  declarations:[
    OrderSuccessComponent,
  ]
})
export class orderSuccessModule { }
