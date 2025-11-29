import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { EventsComponent } from './events.component';
import { AddEventComponent } from './add-event/add-event.component';
import { ShowEventComponent } from './show-event/show-event.component';
import { MapModule } from 'src/app/components/map/map.module';
import { AddressSearchModule } from 'src/app/components/address-search/address-search.module';

@NgModule({
  declarations: [
    EventsComponent,
    AddEventComponent,
    ShowEventComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MapModule,
    AddressSearchModule
  ],
  exports: [
    SharedModule,
    FormsModule,
  ]
})
export class EventsModule { }
