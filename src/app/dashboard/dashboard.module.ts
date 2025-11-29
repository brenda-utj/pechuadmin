import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MomentModule } from "ngx-moment";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(DashboardRoutes),
    MomentModule,
    NgxSpinnerModule,

    //NgxSpinnerModule.forRoot({ type: "ball-scale-multiple" }),
    // NgxLoadingModule.forRoot({
    //   animationType: ngxLoadingAnimationTypes.wanderingCubes,
    //   backdropBackgroundColour: 'rgba(0,0,0,0.6)',
    //   backdropBorderRadius: '4px',
    //   primaryColour: '#ffffff',
    //   secondaryColour: '#ffffff',
    //   tertiaryColour: '#ffffff'
    // }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
