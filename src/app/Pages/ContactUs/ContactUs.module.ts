import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './ContactUs';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';
import { FormsModule } from '@angular/forms';










const ChildRoutes: Routes = [
  {
    path: 'contact-us',
    component:ContactUsComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
    LoaderModule,
    FormsModule
  ],
  declarations:[
    ContactUsComponent
  ]
})
export class contactUsModule { }
