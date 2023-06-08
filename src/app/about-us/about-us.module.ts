import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';
import { FormsModule } from '@angular/forms';
import { AboutUsComponent } from './about-us.component';










const ChildRoutes: Routes = [
  {
    path: 'about-us',
    component:AboutUsComponent
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
    AboutUsComponent
  ]
})
export class AboutUsModule { }
