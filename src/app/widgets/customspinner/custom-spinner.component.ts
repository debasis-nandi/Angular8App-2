import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

declare var $: any;

@Component({
    selector: 'my-custom-spinner',
    templateUrl: './custom-spinner.component.html',
    styleUrls: ['custom-spinner.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CustomSpinnerComponent implements OnInit {

    @Input() loading: boolean = false;
    @Input() isPopupLoading: boolean = false;
    
    constructor(){
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.isPopupLoading) {
            if (this.loading) {
                $('#popup-spin').show(0);
            }
            else {
                $('#popup-spin').hide(0);
            }
        }
        else {
            if (this.loading) {
                $('#cover-spin').show(0);
            }
            else {
                $('#cover-spin').hide(0);
            }
        }
    }

}