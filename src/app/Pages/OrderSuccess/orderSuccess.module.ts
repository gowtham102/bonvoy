import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

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
  ],
  providers: [DatePipe]
})
export class orderSuccessModule { }
