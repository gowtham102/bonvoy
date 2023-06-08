import { NgModule } from '@angular/core';
import { TimeFormat } from './time.pipe';







@NgModule({ 
  imports: [
  ],
  declarations:[
      TimeFormat,
  ],
  exports:[
    TimeFormat,
  ]
})
export class PipeModule { }
