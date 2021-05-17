import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MaterialModule } from '../../material.module';
import { CustomSpinnerComponent } from './custom-spinner.component';
@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        MaterialModule,
        OverlayModule
    ],
    declarations:[
        CustomSpinnerComponent
    ],
    providers:[
    ],
    exports: [
        CustomSpinnerComponent
    ]
})

export class CustomLoaderModule { }