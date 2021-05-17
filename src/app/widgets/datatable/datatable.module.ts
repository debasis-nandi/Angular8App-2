import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';

import { DataTableComponent } from './datatable.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        TooltipModule,
        ProgressBarModule
    ],
    declarations:[
        DataTableComponent
    ],
    providers:[
    ],
    exports: [
        DataTableComponent
    ]
})

export class DataTableModule { }