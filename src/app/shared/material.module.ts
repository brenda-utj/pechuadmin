import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [MatDialogModule, MatInputModule, MatFormFieldModule, MatButtonModule,
            MatListModule, MatIconModule, MatTableModule, MatSelectModule, MatSlideToggleModule,
            MatSortModule, MatBottomSheetModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
            MatTabsModule, MatProgressSpinnerModule, MatExpansionModule, MatGridListModule,MatToolbarModule,
            MatSidenavModule, MatMenuModule, MatRadioModule, MatPaginatorModule, MatTooltipModule, MatCheckboxModule,
            MatAutocompleteModule],
  exports: [MatDialogModule, MatInputModule, MatFormFieldModule, MatButtonModule,
            MatListModule, MatIconModule, MatTableModule, MatSelectModule, MatSlideToggleModule,
            MatSortModule, MatBottomSheetModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
            MatTabsModule, MatProgressSpinnerModule, MatExpansionModule, MatGridListModule,MatToolbarModule,
            MatSidenavModule, MatMenuModule, MatRadioModule, MatPaginatorModule, MatTooltipModule, MatCheckboxModule,
            MatAutocompleteModule]
})
export class MaterialModule { }
