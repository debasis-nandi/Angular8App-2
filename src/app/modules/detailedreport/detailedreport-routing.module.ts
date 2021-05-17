import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout.component';
import { DetailedReportComponent } from './detailedreport.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DetailedReportComponent }
    ]
  },
  {
    path: 'report/:fileId',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DetailedReportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailedReportRoutingModule { }
