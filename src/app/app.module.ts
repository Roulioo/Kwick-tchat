import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { NotificationService } from './services/notifierService';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { TchatComponent } from './tchat/tchat.component';
import { TchatService } from './tchat/tchat.service';
import { UsersComponent } from './users/users.component';
import { UsersService } from './users/users.service';

/**
 * Routes of application
 */
const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'tchat', canActivate: [AuthGuardService], component: TchatComponent },
  { path: 'users', canActivate: [AuthGuardService], component: UsersComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: '404', component: ErrorComponent},
  { path: '**', redirectTo: '/404'}
]

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    TchatComponent,
    UsersComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    JwPaginationModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true
    })
  ],
  providers: [
    AuthGuardService,
    AuthService,
    NotificationService,
    TchatService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
