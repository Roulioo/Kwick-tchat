import { CanActivate, Event, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
      private router: Router,
      private authService: AuthService
    ) { }

  /**
   * Method to set auth guard according to state authentification.
   * For example, if user is connected avoid redirection to routerLinks :
   * /auth/signin and /auth/signup
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // user is connected
    if (this.authService.isAuth) {
      this.router.events.subscribe((event: Event)  => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/auth/signin' || event.url === '/auth/signup') {
            this.router.navigate(['home']); // redirect to home page
          }
        }
      })

      return true;
    } else { // user is disconnected
      this.router.navigate(['home']); // redirect to home page

      return false;
    }
  }
}
