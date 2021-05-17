import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['forgotpassword.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {

    forgotPassword:FormGroup;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    imgPath: any = environment.imaPath;
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onLogin(): void{
        this.router.navigateByUrl('login');
    }

    onSubmit(): void {
                
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
