import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
    selector: 'my-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['spinner.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit {

    @Input() value : number = 100;
    @Input() diameter: number = 30;
    @Input() mode : string ="indeterminate";
    @Input() strokeWidth : number = 0;
    @Input() overlay: boolean = false;
    @Input() color: string = "primary";

    constructor(){
    }

    ngOnInit() {
        
    }

    ngOnChanges(){
    }
    
}