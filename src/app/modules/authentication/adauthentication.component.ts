import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';
import { IAuthentication } from './authentication.model';
import { environment } from '../../../environments/environment';
import { MsalADService } from '../../core/services/msal.service';

@Component({
    selector: 'app-adauthentication',
    templateUrl: './adauthentication.component.html',
    styleUrls: ['authentication.component.css']
})
export class ADauthenticationComponent implements OnInit, AfterViewInit, OnDestroy {

    imgPath: any = environment.imaPath;
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;

    isAdAuth: boolean = environment.isAdAuth;
    isToken:boolean = false;
    errorMsg: string;
    isUnauthorized: boolean;
    
    constructor(private fb: FormBuilder, private router: Router,private route: ActivatedRoute, private service: HttpService, private adService: MsalADService) {
        
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.isUnauthorized = params['isUnauthorized'] || false;
        });
        
        /*if(!this.isUnauthorized){
            let idToken: any = this.adService.GetIdToken();
            this.isToken = idToken ? true : false;
            if (idToken) {
                this.getUserInfo();
            }
        }*/
        
        let idToken: any = this.adService.GetIdToken();
        this.isToken = idToken ? true : false;
        if (idToken) {
            this.getUserInfo();
        }
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onSubmit(): void {
        this.errorMsg = "";
        this.router.navigateByUrl('bridge2home');
    }

    getUserInfo(): void {
        this.overlay = true;
        this.service.get(ApiConfig.userInfoApi).subscribe(res => {
            if (res.success) {
                if (res.data && res.data.id) {
                    if (res.data.is_active) {
                        AppSession.setSessionStorage("UserInfo", res.data);
                        this.router.navigateByUrl('home');
                    }
                    else {
                        //this.errorMsg = "You are not an active user in this application. Please contact site administrator.";
                        this.router.navigateByUrl('error/unauthorized');
                    }
                }
                else {
                    //this.errorMsg = "You are not authorized to access this application. Please contact site administrator.";
                    this.router.navigateByUrl('error/unauthorized');
                }
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    getCurrentYear(): string {
        return (new Date()).getFullYear().toString();
    }

}
