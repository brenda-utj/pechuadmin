import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { VacanteComponent } from './vacante.component';
import { ShowVacanteComponent } from './show-vacante/show-vacante.component';
import { AddVacanteComponent } from './add-vacante/add-vacante.component';

@NgModule({
  declarations: [
    VacanteComponent,
    ShowVacanteComponent,
    AddVacanteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    FormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class VacantesModule { }
