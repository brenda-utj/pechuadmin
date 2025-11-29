import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModulosComponent } from './modulos.component';
import { AddModuloComponent } from './add-modulo/add-modulo.component';

@NgModule({
  declarations: [
    ModulosComponent,
    AddModuloComponent
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
export class ModulosModule { }
