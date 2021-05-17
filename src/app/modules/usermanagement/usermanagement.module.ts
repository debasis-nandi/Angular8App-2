import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';

import { UserManagementRoutingModule } from './usermanagement-routing.module';
import { UserManagementComponent } from './usermanagement.component';
import { AddUserComponent } from './adduser.component';

import { SharedModule } from '../../shared/shared.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { CoreModule } from '../../core/core.module';
import { CustomLoaderModule } from '../../widgets/customspinner/custom-spinner.module';
import { DataTableModule } from '../../widgets/datatable/datatable.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserManagementRoutingModule,
    SharedModule,
    LoaderModule,
    CustomLoaderModule,
    CoreModule,
    GrowlModule,
    DialogModule,
    ButtonModule,
    DataTableModule
  ],
  declarations: [
    UserManagementComponent,
    AddUserComponent
  ]
})
export class UserManagementModule { }
