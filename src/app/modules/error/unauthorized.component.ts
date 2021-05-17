import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { AppSession } from '../../core/config/app-session';
import { ApiConfig } from '../../core/config/api-config';
import { IToken } from '../../modules/authentication/authentication.model';
import { MsalADService } from '../../core/services/msal.service';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['error.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UnAuthorizedComponent implements OnInit {

    overlay: boolean = false;
    token: IToken = {};
    refreshCount: number = 0;

    constructor(private router: Router, private service: HttpService, private adService: MsalADService) {
    }

    ngOnInit() {
        AppSession.clearSessionStorage('msal.idtoken');
    }

    takeMeLogin(): void{
        //this.router.navigateByUrl('login');
        //this.router.navigate(['/login/adauth', true]);
        //this.router.navigateByUrl('bridge2home');

        var a, b;
        window.onbeforeunload = function (e) {
            if (b) return;
            a = setTimeout(function () {
                b = true;
                window.location.href = window.location.origin + '/error/unauthorized';
            }, 500);
            
        }
        window.onunload = function () {
            clearTimeout(a);
        }
        window.location.href = window.location.origin + '/bridge2home';
    }

}
