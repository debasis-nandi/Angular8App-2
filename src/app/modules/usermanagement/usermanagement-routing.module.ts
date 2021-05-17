import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout.component';
import { UserManagementComponent } from './usermanagement.component';
import { AddUserComponent } from './adduser.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: UserManagementComponent }
    ]
  },
  {
    path: 'adduser',
    component: MainLayoutComponent,
    children: [
      { path: '', component: AddUserComponent }
    ]
  },
  {
    path: 'updateuser/:id',
    component: MainLayoutComponent,
    children: [
      { path: '', component: AddUserComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
