import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {BooklistComponent} from './booklist/booklist.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {LogoutComponent} from './login/logout/logout.component';
import {LoanpageComponent} from './loanpage/loanpage.component';
import {CurrentloanComponent} from './loanpage/currentloan/currentloan.component';
import {HistoryloanComponent} from './loanpage/historyloan/historyloan.component';
import {UsermanagementComponent} from './usermanagement/usermanagement.component';
import {ReturnpageComponent} from './returnpage/returnpage.component';
import {ReturnlandingpageComponent} from './returnlandingpage/returnlandingpage.component';
import {RatingComponent} from './booklist/rating/rating.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LogoutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'books', component: BooklistComponent, canActivate: [AuthGuard]},
  { path: 'loans', component: LoanpageComponent, canActivate: [AuthGuard]},
  { path: 'loans/current/:id', component: CurrentloanComponent, canActivate: [AuthGuard]},
  { path: 'loans/history/:id', component: HistoryloanComponent, canActivate: [AuthGuard]},
  { path: 'usermanagement', component: UsermanagementComponent, canActivate: [AuthGuard]},
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  { path: 'return_approval', component: ReturnpageComponent, canActivate: [AuthGuard]},
  { path: 'home', component: ReturnlandingpageComponent},
  { path: 'books/rating/:id', component: RatingComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
