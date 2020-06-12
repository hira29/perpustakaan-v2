import { Component, OnInit } from '@angular/core';

// @ts-ignore
import {_app_config} from '@app-config/app.config';
import {dataDecryption} from '../shared/security.helper';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  LoginDetails: any;
  constructor(
  ) { }

  ngOnInit() {
    this.LoginDetails = this.getAccountLoggedIn();
  }

  getLogindata() {
    if (localStorage.getItem(_app_config.localstorage_prefix + 'user')) {
      return true;
    } else {
      return false;
    }
  }

  getAccountLoggedIn() {
    const acc = localStorage.getItem(_app_config.localstorage_prefix + 'user');
    if (acc) {
      this.LoginDetails = dataDecryption(acc);
    }
    if (this.LoginDetails.role === 'superadmin') {
      return true;
    } else {
      return false;
    }
  }


}
