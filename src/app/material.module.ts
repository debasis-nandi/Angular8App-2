import { NgModule } from '@angular/core';

import {
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatListModule,
    MatExpansionModule,
    MatStepperModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatLabel,
    MatSortModule,
    MatCardModule
} from '@angular/material';

@NgModule({
    imports: [
        MatInputModule,
        MatSelectModule,
        MatSliderModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        MatListModule,
        MatExpansionModule,
        MatStepperModule,
        MatTreeModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatSortModule,
        MatCardModule
    ],
    exports: [
        MatInputModule,
        MatSelectModule,
        MatSliderModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        MatListModule,
        MatExpansionModule,
        MatStepperModule,
        MatTreeModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule
    ]
})
export class MaterialModule { }