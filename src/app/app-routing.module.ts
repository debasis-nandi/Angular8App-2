import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'login',
        loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'bridge2home',
        loadChildren: () => import('./modules/bridge2home/bridge2home.module').then(m => m.Bridge2homeModule),
        canActivate: [MsalGuard]
    },
    {
        path: 'forgotpassword',
        loadChildren: () => import('./modules/forgotpassword/forgotpassword.module').then(m => m.ForgotPasswordModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'detailed',
        loadChildren: () => import('./modules/detailedreport/detailedreport.module').then(m => m.DetailedReportModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'usermanagement',
        loadChildren: () => import('./modules/usermanagement/usermanagement.module').then(m => m.UserManagementModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'error',
        loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule)
    },
    {
        path: 'test',
        loadChildren: () => import('./modules/test/test.module').then(m => m.TestModule)
    },
    {
        path: '**',
        redirectTo: 'error',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
