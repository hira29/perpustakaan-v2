import { Component, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/* Config */
// @ts-ignore
import { _app_config } from '@app-config/app.config';

/* Helper */
import { dataEncryption } from 'src/app/shared/security.helper';
import { NotificationService} from '../notification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  uri = 'https://lib-ws-mdb.herokuapp.com/';
  // uri = 'http://localhost:6996/';
  public loginObj = { password: '', username: ''};
  public showLoginForm = false;
  public loginSub: Subscription;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: NotificationService,
  ) { }

  ngOnInit() {
    this.showLoginForm = true;

    /* IF HAVE A LOGIN SESSION */
    if (localStorage.getItem(_app_config.localstorage_prefix + 'user')) {
      this.router.navigate(['/dashboard']);
    }

  }
  onLogin() {
    this.loginSub = this.http.post<any>(
      this.uri + 'perpustakaan/api/v1/usermanagement/login'
      , this.loginObj).subscribe(x => {
        const account = x.data;

        if (x.status === true) {
          this.toastr.showSuccess(x.message, 'Berhasil');
          const enc = dataEncryption(account);
          localStorage.setItem(_app_config.localstorage_prefix + 'user', enc);
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.showError(x.message, 'Gagal');
        }
    });
  }

  getUname(value) {
    this.loginObj.username = value;
  }
  getUpass(value) {
    this.loginObj.password = value;
  }
  keyDownFunction(event) {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }


}
