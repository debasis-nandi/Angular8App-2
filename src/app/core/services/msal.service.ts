import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';

@Injectable()
export class MsalADService {

    private idToken: any;
    public clientApplication: Msal.UserAgentApplication = null;

    constructor(private authService: MsalService) {
        this.clientApplication = new Msal.UserAgentApplication(
            environment.uiClienId,
            environment.authority + environment.tenantId,
            this.authCallback,
            {
                storeAuthStateInCookie: true,
                //cacheLocation: 'localStorage' ,
                //postLogoutRedirectUri: environment.redirectUrl
                postLogoutRedirectUri: window.location.origin
            });
    }

    public GetIdToken(): Observable<any> {
        if (sessionStorage.getItem('msal.idtoken') !== undefined && sessionStorage.getItem('msal.idtoken') != null) {
            this.idToken = sessionStorage.getItem('msal.idtoken');
        }
        return this.idToken;
    }

    /*public GetIdToken(): Observable<any> {
        let renewIdTokenRequest = {
            scopes: environment.uiClienId
        };
        if (sessionStorage.getItem('msal.idtoken') !== undefined && sessionStorage.getItem('msal.idtoken') != null) {
            this.idToken = sessionStorage.getItem('msal.idtoken');

        }
        else {
            if (this.clientApplication.getUser()) {
                let scope: any = ['user.read'];
                this.clientApplication.acquireTokenSilent(scope).then(response => {
                    // send response.idToken to the backend
                }).catch(error => {
                    // if it is an InteractionRequired error, send the same request in an acquireToken call
                });
            }
        }
        return this.idToken;
    }*/

    public authCallback(errorDesc, token, error, tokenType) {
        if (token) {

        } else {
            console.log(error + ':' + errorDesc);
        }
    }

    public getCurrentUserInfo() {
        let user = this.clientApplication.getUser();
        //alert(user.name);
    }

    public logout() {
        this.clientApplication.logout();
    }

}


