import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { ADauthenticationComponent } from './adauthentication.component';

import { SharedModule } from '../../shared/shared.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { CustomLoaderModule } from '../../widgets/customspinner/custom-spinner.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    SharedModule,
    LoaderModule,
    CustomLoaderModule,
    CoreModule,
    GrowlModule,
    DialogModule,
    ButtonModule
  ],
  declarations: [
    AuthenticationComponent,
    ADauthenticationComponent
  ]
})
export class AuthenticationModule { }
