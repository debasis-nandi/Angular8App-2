import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  imgPath: any = environment.imaPath;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    
  }

}