import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SucursalComponent } from './sucursal.component';
import { AddsucursalComponent } from './addsucursal/addsucursal.component';

@NgModule({
  declarations: [
    SucursalComponent,
    AddsucursalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    SharedModule,
    FormsModule
  ]
})
export class SucursalModule { }
