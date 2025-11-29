import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TipoSubtipoComponent } from './tipo-subtipo.component';
import { AddTipoComponent } from './add-tipo/add-tipo.component';

@NgModule({
  declarations: [
    TipoSubtipoComponent,
    AddTipoComponent
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
export class TipoSubtipoModule { }
