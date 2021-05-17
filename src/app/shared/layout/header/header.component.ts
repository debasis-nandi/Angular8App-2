import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../../core/services/http.service';
import { ApiConfig } from '../../../core/config/api-config';
import { AppSession } from '../../../core/config/app-session';
import { Role } from '../../../core/config/app-enum';
import { environment } from '../../../../environments/environment';
import { MsalADService } from '../../../core/services/msal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {

  imgPath: any = environment.imaPath;
  userInfo: any;
  isAdmin: boolean;
  
  constructor(private router: Router, private service: HttpService, private adService: MsalADService) {
  }

  ngOnInit() {
    this.userInfo = AppSession.getSessionStorage("UserInfo") ? AppSession.getSessionStorage("UserInfo") : null;
    this.isAdmin = (this.userInfo.role_name == Role.admin) ? true : false;
  }

  onLogout(): void {
    AppSession.clearSessionStorage("UserInfo");
    this.adService.logout();
  }

}