import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderFailedComponent } from './orderFailed';












const ChildRoutes: Routes = [
  {
    path: 'order-failed',
    component:OrderFailedComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
  ],
  declarations:[
    OrderFailedComponent,
  ]
})
export class orderFailedModule { }
