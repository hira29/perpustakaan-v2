import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { CanActivate, Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


/* Config */
// @ts-ignore
import { _app_config } from '@app-config/app.config';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!localStorage.getItem(_app_config.localstorage_prefix + 'user')) {
      // alert('You don\'t have authentication to entrance this page.');
      this.router.navigate(['/home']);
      return false;
    } else {
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: NavigationEnd) => {
            // this.router.navigate(['/dashboard']);
          }
        );
    }
    return true;
  }

}
