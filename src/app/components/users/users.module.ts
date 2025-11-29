import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user/add-user.component'

@NgModule({
  declarations: [
    UsersComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    SharedModule,
    MaterialModule,
    FormsModule
  ]
})
export class UsersModule { }
