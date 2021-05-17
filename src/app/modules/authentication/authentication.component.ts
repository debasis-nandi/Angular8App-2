import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';
import { IAuthentication } from './authentication.model';
import { environment } from '../../../environments/environment';
import { MsalADService } from '../../core/services/msal.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['authentication.component.css']
})
export class AuthenticationComponent implements OnInit, AfterViewInit, OnDestroy {

    loginForm:FormGroup;
    
    imgPath: any = environment.imaPath;
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;

    isAdAuth: boolean = environment.isAdAuth;
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService, private adService: MsalADService) {
        
    }

    ngOnInit() {
        /*let idToken: any = this.adService.GetIdToken();
        if (idToken) {
            this.getUserInfo();
        }*/
        
        if(this.isAdAuth){
            this.router.navigateByUrl('login/adauth');
        }
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    getUserInfo(): void {
        this.overlay = true;
        this.service.get(ApiConfig.userInfoApi).subscribe(res => {
            if (res.success) {
                AppSession.setSessionStorage("UserInfo", res.data);
                this.overlay = false;
                this.router.navigateByUrl('home');
            }
            else {
                this.overlay = false;
            }
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    onSubmit(): void {
        this.router.navigateByUrl('home');
    }

    onForgotPassword(): void{
        this.router.navigateByUrl('forgotpassword');
    }

    getCurrentYear(): string {
        return (new Date()).getFullYear().toString();
    }

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

}
