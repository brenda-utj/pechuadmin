import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TicketComponent } from './ticket.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { TicketNotificationComponent } from './ticket-notification/ticket-notification.component';

@NgModule({
  declarations: [
    TicketComponent,
    AddTicketComponent,
    TicketNotificationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DragDropModule
  ],
  exports: [
    SharedModule,
    FormsModule,
    DragDropModule
  ]
})
export class TicketModule { }
