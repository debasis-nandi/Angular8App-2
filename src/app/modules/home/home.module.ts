import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';
import { TableModule } from 'primeng/table';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
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
    HomeRoutingModule,
    SharedModule,
    LoaderModule,
    CustomLoaderModule,
    CoreModule,
    GrowlModule,
    DialogModule,
    ButtonModule,
    DataTableModule,
    TableModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
