import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RoutingModule } from './routing.module';
import { BooklistComponent } from './booklist/booklist.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
// import {NgxPaginationModule} from 'ngx-pagination';
import { PaginationModule} from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './auth.guard';
import { LogoutComponent } from './login/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    BooklistComponent,
    LoginComponent,
    LogoutComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RoutingModule,
        ModalModule.forRoot(),
        HttpClientModule,
        FormsModule,
        ToastrModule.forRoot(),
        // NgxPaginationModule
        PaginationModule.forRoot(),
        TooltipModule.forRoot()
    ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
