import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FooterOnlyLayoutComponent } from '../../shared/layout/footer-only-layout/footer-only-layout.component';
import { LoginLayoutComponent } from '../../shared/layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { UnAuthorizedComponent } from './unauthorized.component';
import { ErrorComponent } from './error.component';

const routes: Routes = [
  {
    path: '',
    component: FooterOnlyLayoutComponent,
    children: [
      { path: '', component: ErrorComponent },
      { path: 'notfound', component: PageNotFoundComponent },
      { path: 'unauthorized', component: UnAuthorizedComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
