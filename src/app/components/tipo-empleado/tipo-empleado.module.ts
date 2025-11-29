import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TipoEmpleadoComponent } from './tipo-empleado.component';
import { AddTipoEmpleadoComponent } from './add-tipo-empleado/add-tipo-empleado.component';

@NgModule({
  declarations: [
    TipoEmpleadoComponent,
    AddTipoEmpleadoComponent
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
export class TipoEmpleadoModule { }
