import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WarrantyComponent } from './warranty.component';
import { FormsModule } from '@angular/forms';

const ChildRoutes: Routes = [
  {
    path: 'warranty',
    component:WarrantyComponent
  },
  
  ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule
  ]
})
export class WarrantyModule { }
