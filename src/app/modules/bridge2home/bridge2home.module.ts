import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GrowlModule } from 'primeng/growl';

import { Bridge2homeRoutingModule } from './bridge2home-routing.module';
import { Bridge2homeComponent } from './bridge2home.component';

import { SharedModule } from '../../shared/shared.module';
import { LoaderModule } from '../../widgets/spinner/spinner.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Bridge2homeRoutingModule,
    SharedModule,
    LoaderModule,
    CoreModule,
    GrowlModule,
    DialogModule,
    ButtonModule
  ],
  declarations: [
    Bridge2homeComponent
  ]
})
export class Bridge2homeModule { }
