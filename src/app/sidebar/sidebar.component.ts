import { Component, OnInit } from '@angular/core';

// @ts-ignore
import {_app_config} from '@app-config/app.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit() {
  }

  getLogindata() {
    if (localStorage.getItem(_app_config.localstorage_prefix + 'user')) {
      return true;
    } else {
      return false;
    }
  }

}
