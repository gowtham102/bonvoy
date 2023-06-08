import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacyPolicy';










const ChildRoutes: Routes = [
  {
    path: 'privacy-policy',
    component:PrivacyPolicyComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
  ],
  declarations:[
    PrivacyPolicyComponent
  ]
})
export class privacyPolicyModule { }
