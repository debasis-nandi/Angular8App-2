import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppSession } from '../../../core/config/app-session';
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  imgPath: any = environment.imaPath;
  
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadScript();
  }

  ngOnDestroy() {
  }

  loadScript() {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
        $('#back-to-top').fadeIn();
      } else {
        $('#back-to-top').fadeOut();
      }
    });

    $('#back-to-top').click(function () {
      $('#back-to-top').tooltip('hide');
      $('body,html').animate({
        scrollTop: 0
      }, 1000);
      return false;
    });

    $('#back-to-top').tooltip('show');
  }

}