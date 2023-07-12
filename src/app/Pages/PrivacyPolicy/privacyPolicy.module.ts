import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacyPolicy';
import { ShippingpolicyComponent } from 'src/app/shippingpolicy/shippingpolicy.component';
import { EwasteComponent } from 'src/app/ewaste/ewaste.component';
import { ReplacementpolicyComponent } from 'src/app/replacementpolicy/replacementpolicy.component';
import { WarrantyComponent } from 'src/app/warranty/warranty.component';
import { WarrantypolicyComponent } from 'src/app/warrantypolicy/warrantypolicy.component';










const ChildRoutes: Routes = [
  {
    path: 'privacy-policy',
    component:PrivacyPolicyComponent
  },
  {
    path: 'shipping-policy',
    component:ShippingpolicyComponent
  },
  {
    path: 'e-waste-policy',
    component:EwasteComponent
  },
  {
    path: 'replacement-policy',
    component:ReplacementpolicyComponent
  },
  {
    path: 'warranty-policy',
    component:WarrantypolicyComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
  ],
  declarations:[
    PrivacyPolicyComponent,
    ShippingpolicyComponent,
    EwasteComponent,ReplacementpolicyComponent,WarrantypolicyComponent
  ]
})
export class privacyPolicyModule { }
