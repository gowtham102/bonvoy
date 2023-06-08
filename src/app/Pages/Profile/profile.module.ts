import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AgmCoreModule} from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileComponent } from './profile';
import { MyAccountComponent } from './MyAccount/myAccount';
import { OrderListComponent } from './Orders/OrderList/orderList';
import { OrderDetailsComponent } from './Orders/OrderDetails/orderDetails';
import { AddressComponent } from './Address/address';
import { WishlistComponent } from './Wishlist/wishlist';
import { WalletComponent } from './Wallet/wallet';
import { ReminderComponent } from './Reminder/reminder';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/SharedResources/Components/Loader/loader.module';












const ChildRoutes: Routes = [
  {
    path: 'my-profile',
    component:ProfileComponent,
    children: [
        {
            path: '',
            component: MyAccountComponent, 
        },
        {
            path: 'my-orders',
            component: OrderListComponent, 
        },
        {
            path: 'order-details',
            component: OrderDetailsComponent, 
        },
        {
            path: 'my-address',
            component: AddressComponent, 
        },
        {
            path: 'my-wishlist',
            component: WishlistComponent, 
        },
        {
            path: 'my-wallet',
            component: WalletComponent, 
        },
        {
            path: 'reminders',
            component: ReminderComponent, 
        },
      
    ],
  },
  ]
 
@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyDA3vOcn5iDR0zPp4CjkTcunLir_95Iy54",
      libraries: ['places']
    }),
    CommonModule,
    FormsModule,
    LoaderModule
  ],
  declarations:[
      ProfileComponent,
      MyAccountComponent,
      OrderListComponent,
      OrderDetailsComponent,
      WishlistComponent,
      AddressComponent,
      WishlistComponent,
      ReminderComponent,
      WalletComponent
  ]
})
export class ProfileModule { }
