import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notifierService';
import { User } from './user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public pageOfPagination: Array<any>;
  public usersOnline: Array<string>;
  public userStorage: User;

  constructor(
    public authService: AuthService,
    private notifier: NotificationService,
    private userService: UsersService
  ) {
    this.userStorage = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    if (this.userStorage) { this.getUsersOnline() }
  }

  /**
   * Get users online
   */
  public getUsersOnline() {
    // api request get users logged
    this.userService.getUsersLogged(this.userStorage.token).subscribe(
      (res) => { // success
        if (res.result.status === 'done') {
          this.usersOnline = res.result.user
          this.notifier.showSuccess('Users onlines are refreshed', 'Notification');
        } else { // error
          this.notifier.showError('Error during getting users onlines', 'Notification');
        }
      }
    );
  }

  /**
   * Event trigger in each page changes
   * Affect new pages and items that go with them
   * @param pageOfPagination Number of pagination
   */
  public onChangePage(pageOfPagination: Array<any>) {
    this.pageOfPagination = pageOfPagination;
  }

}
