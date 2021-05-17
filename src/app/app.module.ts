import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalInterceptor, BroadcastService, MsalService } from '@azure/msal-angular';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'hammerjs';

import { MsalADService } from './core/services/msal.service';
import { environment } from 'src/environments/environment';
import { EnvService } from './core/services/env.service';
import { AuthGuard } from './core/guards/auth.guard';

export const protectedResourceMap: any = [
    [environment.baseUrl, environment.scopeUri]
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    MsalModule.forRoot({
      clientID: environment.uiClienId,
      authority: environment.authority + environment.tenantId,
      //cacheLocation: 'localStorage',
      consentScopes: ['email'],
      //protectedResourceMap: protectedResourceMap,
      //redirectUri: environment.redirectUrl,
      redirectUri: window.location.origin,
      //postLogoutRedirectUri: environment.redirectUrl
      postLogoutRedirectUri: window.location.origin
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (envService: EnvService) => () => envService.init(),
      deps: [EnvService],
      multi: true
    },
    HttpClient,
    MsalADService,
    MsalService,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    //{ provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
