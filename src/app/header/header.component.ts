import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { interval, Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notifierService';
import { User } from '../users/user.model';

import IdleTimer from '../idleTimer/idleTimer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public counterSubscription: Subscription;
  public seconds: number;
  public timer: IdleTimer;
  public userStorage: User;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notifierService: NotificationService
  ) {
    this.userStorage = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    if (this.userStorage && this.userStorage.isAuth) {
      this.authService.isAuth = true;

      // logout user after 1200 seconds (20 minutes)
      this.timer = new IdleTimer({
        timeout: 1200,
        onTimeout: () => { this.removeLocalStorageLogout() },
        inactivityTime: 0
      });

      // generate an interval each all 1000 ms
      const counter = interval(1000);

      // seconds of inactivity
      this.counterSubscription = counter.subscribe(() => {
        this.seconds = JSON.parse(localStorage.getItem('inactivityTime'))
      });
    } else {
      this.authService.isAuth = false;
    }
  }

  /**
   * Logout user connection
   */
  public logout() {
    // api request logout
    this.authService.logout(this.userStorage.token, this.userStorage.id).subscribe(
      (res) => {
        if (res.result.status === 'done') {
          // unuscribe the subscription
          this.counterSubscription.unsubscribe();

          // clean timer
          this.timer.cleanUp();

          // remove local storage of user and disconnect
          this.removeLocalStorageLogout();

          // redirect to home page
          this.router.navigate(['/home']);

          // notification
          this.notifierService.showSuccess('You has been disconnected', 'Notification');
        } else {
          this.removeLocalStorageLogout();
          this.notifierService.showError('Error durring disconnection', 'Notification');
        }
      }
    );
  }

  /**
   * Remove local storage items in logout
   */
  public removeLocalStorageLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRoute');
    localStorage.removeItem('inactivityTime');
    localStorage.removeItem('firstLoadingPage');
    localStorage.removeItem('selectedTimeOfTchat');

    this.authService.isAuth = false;

    // reloading page
    location.reload();
  }

}
