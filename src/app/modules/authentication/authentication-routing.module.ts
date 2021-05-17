import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginLayoutComponent } from '../../shared/layout/login-layout/login-layout.component';
import { AuthenticationComponent } from './authentication.component';
import { ADauthenticationComponent } from './adauthentication.component';

const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: AuthenticationComponent }
    ]
  },
  {
    path: 'adauth',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: ADauthenticationComponent }
    ]
  },
  {
    path: 'adauth/:isUnauthorized',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: ADauthenticationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
