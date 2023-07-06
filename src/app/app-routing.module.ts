import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/Home/home';
import { authGuard } from './SharedResources/Services/authGuard.service';
import { ThankyouComponent } from './thankyou/thankyou.component';



const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    pathMatch:'full'
  },
  {
    path: '',
    loadChildren: () => import('./Pages/ProductList/productList.module').then(m => m.productListModule)
  },
  {
    path: '',
    loadChildren: () => import('./Pages/ProductDetails/productDetails.module').then(m => m.productDetailsModule)
  },
  {
    path: '',
    loadChildren: () => import('./Pages/Cart/cart.module').then(m => m.cartModule),
    canActivate : []
  },

 
  {
    path: '',
    loadChildren: () => import('./Pages/Checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate : [authGuard]
  },
  {
    path: '',
    loadChildren: () => import('./Pages/OrderSuccess/orderSuccess.module').then(m => m.orderSuccessModule),
    canActivate : [authGuard]
  },
  {
    path: '',
    loadChildren: () => import('./Pages/OrderFailed/orderFailed.module').then(m => m.orderFailedModule),
    canActivate : [authGuard]
  },
  {
    path: '',
    loadChildren: () => import('./Pages/Profile/profile.module').then(m => m.ProfileModule),
    canActivate : [authGuard]
  },
  
  {
    path: '',
    loadChildren: () => import('./Pages/PrivacyPolicy/privacyPolicy.module').then(m => m.privacyPolicyModule)
  },
  {
    path: '',
    loadChildren: () => import('./Pages/TermsAndCondition/termsAndCondition.module').then(m => m.termsConditionModule),
  },
  {
    path: '',
    loadChildren: () => import('./Pages/ContactUs/ContactUs.module').then(m => m.contactUsModule),
  },
  {
    path: '',
    loadChildren: () => import('./Pages/GuestAddress/GuestAddress.module').then(m => m.guestAddressModule),
  },
  {
    path: '',
    loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
  },
  {
    path: '**',
    redirectTo:'/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
