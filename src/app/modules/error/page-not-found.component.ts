import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['error.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PageNotFoundComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    onLogin(){
        this.router.navigateByUrl('login');
    }

}
