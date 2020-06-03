import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/* Service */
// @ts-ignore
import { _app_config } from '@app-config/app.config';

import {dataDecryption} from '../../shared/security.helper';
import {NotificationService} from '../../notification.service';

@Component({
  selector: 'app-logout',
  template: ``,
  styles: [``]
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private toastr: NotificationService,
  ) { }

  ngOnInit() {
    this.logout();
  }

  getAccountLoggedIn() {
    let result: string;
    const acc = localStorage.getItem(_app_config.localstorage_prefix + 'user');

    if (acc) {
      result = dataDecryption(acc);
    }
    return result;
  }
  logout() {
    const account = this.getAccountLoggedIn();
    if (account !== undefined) {
      localStorage.clear();
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
    this.toastr.showSuccess('Anda berhasil Keluar', 'Berhasil');
  }
}
