import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';
import { FormsModule } from '@angular/forms';
import { GuestAddressComponent } from './GuestAddress';
import {AgmCoreModule} from '@agm/core';
import { ThankyouComponent } from 'src/app/thankyou/thankyou.component';










const ChildRoutes: Routes = [
  {
    path: 'a/:id',
    component:GuestAddressComponent
  },

  {
    path:'thankyou',
    component:ThankyouComponent
  }
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
    LoaderModule,
    FormsModule,
    AgmCoreModule.forRoot({
        apiKey:"AIzaSyDA3vOcn5iDR0zPp4CjkTcunLir_95Iy54",
        libraries: ['places']
    }),
  ],
  declarations:[
    GuestAddressComponent,
    ThankyouComponent
  ]
})
export class guestAddressModule { }
