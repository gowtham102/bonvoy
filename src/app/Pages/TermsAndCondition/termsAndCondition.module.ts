import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TermsConditionComponent } from './termsAndCondition';










const ChildRoutes: Routes = [
  {
    path: 'terms-&-condition',
    component:TermsConditionComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
  ],
  declarations:[
    TermsConditionComponent
  ]
})
export class termsConditionModule { }
