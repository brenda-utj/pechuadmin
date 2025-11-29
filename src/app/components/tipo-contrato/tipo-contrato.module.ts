import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TipoContratoComponent } from './tipo-contrato.component';
import { AddTipoContratoComponent } from './add-tipo-contrato/add-tipo-contrato.component';

@NgModule({
  declarations: [
    TipoContratoComponent,
    AddTipoContratoComponent
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
export class TipoContratoModule { }
