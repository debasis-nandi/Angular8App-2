import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

import { DetailedReportRoutingModule } from './detailedreport-routing.module';
import { DetailedReportComponent } from './detailedreport.component';
import { SharedModule } from '../../shared/shared.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { CustomLoaderModule } from '../../widgets/customspinner/custom-spinner.module';
import { CoreModule } from '../../core/core.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DetailedReportRoutingModule,
    SharedModule,
    LoaderModule,
    CustomLoaderModule,
    CoreModule,
    GrowlModule,
    DialogModule,
    ButtonModule,
    ChartModule,
    ProgressBarModule,
    DataTableModule,
    DropdownModule,
    TooltipModule
  ],
  declarations: [
    DetailedReportComponent
  ]
})
export class DetailedReportModule { }
