import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AddressSearchComponent } from './address-search.component';

@NgModule({
  declarations: [
    AddressSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    SharedModule,
    FormsModule,
    AddressSearchComponent
  ]
})
export class AddressSearchModule { }
