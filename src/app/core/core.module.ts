import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpService } from './services/http.service';
import { HttpInterceptorService } from './services/api-interceptor.service';
import { AuthGuard } from '../core/guards/auth.guard';
import { MsalADService } from '../core/services/msal.service';
import { CustomValidationService } from '../core/services/customvalidation.service';

import { ManageHttpInterceptor } from '../core/services/managehttp.interceptor';
import { HttpCancelService } from '../core/services/httpcancel.service';

@NgModule({
    imports: [
      CommonModule,
      HttpClientModule
    ],
    declarations: [],
    providers: [
      HttpService,
      AuthGuard,
      MsalADService,
      CustomValidationService,
      { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
      HttpCancelService,
    { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true }
    ],
    exports: []
  })
  export class CoreModule {}
