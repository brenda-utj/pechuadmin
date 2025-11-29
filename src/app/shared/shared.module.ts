import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { RouterModule } from '@angular/router';
import { MomentModule } from "ngx-moment";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FullCalendarModule } from '@fullcalendar/angular';


// Angular Material Modules
import { MaterialModule } from './material.module';

import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { MaterialTimePickerComponent } from '@candidosales/material-time-picker';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule,
    FullCalendarModule,

    MomentModule,
    LeafletModule,
    NgMultiSelectDropDownModule,
    
    // Angular Material
    MaterialModule,
            MaterialTimePickerComponent,
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule,
    FullCalendarModule,

    MomentModule,
    LeafletModule,
    NgMultiSelectDropDownModule,
    
    // Angular Material
    MaterialModule,

    SidebarComponent,
            MaterialTimePickerComponent,
    
  ]
})
export class SharedModule { }
