import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse, HttpInterceptor, HttpHeaders } from "@angular/common/http";
import { Observable, Subscriber, of, throwError } from 'rxjs';
import { tap, map, filter, catchError } from 'rxjs/operators';

import { AppSession } from '../config/app-session';
import { MsalADService } from '../../core/services/msal.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private router: Router, private adService: MsalADService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let idToken: any = this.adService.GetIdToken() ? this.adService.GetIdToken() : null;
        if (idToken) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${idToken}` }
            });

            /*request = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + idToken)
            });*/
        }

        /*let headerSettings: {[name: string]: string | string[]; } = {};
        if(bearerToken){
            headerSettings['Authorization'] = 'Bearer ' + idToken;
        }
        let newHeader = new HttpHeaders(headerSettings);
        request = request.clone({ headers: newHeader });*/

        //return next.handle(request);
        return next.handle(request).pipe(catchError((error, caught) => {
            //intercept the respons error and displace it to the console
            //console.log(error);
            this.handleAuthError(error);
            return of(error);
        }) as any);
    }

    handleAuthError(err: HttpErrorResponse): Observable<any> {
        
        //401 Unauthorized
        if (err.status === 401 || err.status === 403) {
            console.log('handled error ' + err.status);
            this.router.navigateByUrl('error/unauthorized');
            return of(err.message);
        }
        //Not Found
        else if (err.status === 404) {
            console.log('handled error ' + err.status);
            this.router.navigateByUrl('error/notfound');
            return of(err.message);
        }
        // Internal server error
        /*else if (err.status === 500) {
            console.log('handled error ' + err.status);
            this.router.navigateByUrl('error');
            return of(err.message);
        }*/
        else{
            if(err && err.error){
                let errMsg = `Error: ${err.error.message}`;
                window.alert(errMsg);
            }
        }

        throw err;
    }

    handleError(error: HttpErrorResponse) {
        let errMsg = '';
        // Client Side Error
        if (error.error instanceof ErrorEvent) {
            errMsg = `Error: ${error.error.message}`;
        }
        else {  // Server Side Error
            errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        // return an observable
        return throwError(errMsg);
    };
}