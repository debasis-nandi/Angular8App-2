import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['error.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    onLogin(){
        this.router.navigateByUrl('login');
    }

}
