import {Component, HostListener, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {_app_config} from '@app-config/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Perpustakaan';

  constructor(@Inject(DOCUMENT) document) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 60) {
      const element = document.getElementById('navbar');
      element.classList.add('sticky-header');
      const element2 = document.getElementById('content');
      element2.classList.add('content-when-sticky-header');
    } else {
      const element = document.getElementById('navbar');
      element.classList.remove('sticky-header');
      const element2 = document.getElementById('content');
      element2.classList.remove('content-when-sticky-header');
    }
  }

  getLogindata() {
    if (localStorage.getItem(_app_config.localstorage_prefix + 'user')) {
      return true;
    } else {
      return false;
    }
  }
}
