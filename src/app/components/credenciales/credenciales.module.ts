import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CredencialesComponent } from './credenciales.component';
import { AddCredencialesComponent } from './add-credenciales/add-credenciales.component';
import { AssignCredencialesComponent } from './assign-credenciales/assign-credenciales.component';

@NgModule({
  declarations: [
    CredencialesComponent,
    AddCredencialesComponent,
    AssignCredencialesComponent
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
export class CredencialesModule { }
