import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {AgmCoreModule} from '@agm/core';


import { CheckoutComponent } from './checkout';
import { AddonsComponent } from './Addons/addons';
import { AddAddressComponent } from './Address/AddAddress/addAddress';
import { AddressListComponent } from './Address/AddressList/addressList';
import { PaymentComponent } from './Payment/payment';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';
import { PipeModule } from 'src/app/SharedResources/Pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';











const ChildRoutes: Routes = [
  {
    path: 'checkout',
    component:CheckoutComponent,
    children: [
      {
        path: '', 
        component: AddonsComponent, 
      },
      {
        path: 'add-address', 
        component: AddAddressComponent, 
      },
      {
        path: 'address', 
        component: AddressListComponent, 
      },
      {
        path: 'payment', 
        component: PaymentComponent, 
      },
    ],
  },
  ]
 
@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyDA3vOcn5iDR0zPp4CjkTcunLir_95Iy54",
      libraries: ['places']
    }),
    CommonModule,
    FormsModule,
    LoaderModule,
    PipeModule,
    NgbModule
  ],
  declarations:[
    CheckoutComponent,
    AddonsComponent,
    AddAddressComponent,
    AddressListComponent,
    PaymentComponent
  ],
  providers: [DatePipe]
})
export class CheckoutModule { }
