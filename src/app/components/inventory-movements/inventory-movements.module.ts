import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InventoryMovementsComponent } from './inventory-movements.component';

@NgModule({
  declarations: [
    InventoryMovementsComponent
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
export class InventoryMovementsModule { }
