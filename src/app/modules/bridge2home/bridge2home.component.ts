import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';
import { MsalADService } from '../../core/services/msal.service';

@Component({
    selector: 'app-bridge2home',
    templateUrl: './bridge2home.component.html'
})
export class Bridge2homeComponent implements OnInit, AfterViewInit, OnDestroy {

    imgPath: any = environment.imaPath;
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;

    constructor(private fb: FormBuilder, private router: Router, private service: HttpService, private adService: MsalADService) {
        
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

}
