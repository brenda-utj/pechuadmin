import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZoneComponent } from './zone.component';

@NgModule({
  declarations: [ZoneComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
  ],
  exports: [
    FormsModule,
    SharedModule,
  ]
})
export class ZoneModule { }
