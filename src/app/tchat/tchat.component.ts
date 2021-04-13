import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notifierService';
import { Tchat } from './tchat.model';
import { TchatService } from './tchat.service';
import { User } from '../users/user.model';

@Component({
  selector: 'app-tchat',
  templateUrl: './tchat.component.html',
  styleUrls: ['./tchat.component.scss']
})
export class TchatComponent implements OnInit {

  public userStorage: User;
  public userMessages: Array<Tchat>;
  public messageForm: FormGroup;
  public pageOfPagination: Array<any>;
  public selectedTime: number;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private notifier: NotificationService,
    private tchatService: TchatService
  ) {
    this.userStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.selectedTime = JSON.parse(localStorage.getItem('selectedTimeOfTchat'));
  }

  ngOnInit() {
    // get all user messages
    if (this.userStorage) { this.getUserMessages() }

    // init message form
    this.messageForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(140)]]
    });
  }

  /**
   * Get user messages
   */
  public getUserMessages() {
    // api request get users messages
    this.tchatService.getMessagesList(this.userStorage.token, 0).subscribe(res => {
      if (res.result.status === 'done') { // success
        this.userMessages = res.result['talk'];
        if (Array.isArray(this.userMessages)) { this.userMessages = this.sortByAsc(this.userMessages) }
        this.notifier.showSuccess('Users messages are refreshed', 'Notification');
      } else { // error
        this.notifier.showError('Error during getting users messages', 'Notification');
      }
    })
  }

  /**
   * Event trigger in each page changes
   * Affect new pages and items that go with them
   * @param pageOfPagination Number of pagination
   */
  public onChangePage(pageOfPagination: Array<any>) {
    this.pageOfPagination = pageOfPagination;
  }

  /**
   * Sort array by ascending order
   * @param arrayToSort Array to sort elements ascending
   */
  public sortByAsc(arrayToSort: Array<Tchat>) {
    return arrayToSort.sort((x, y) => y['timestamp'] - x['timestamp']);
  }

  /**
   * Send message of user
   */
  public sendMessage() {
    // message field
    const message = this.messageForm.get('message').value;

    // api request send user messages
    this.tchatService.sendUserMessage(this.userStorage.token, this.userStorage.id, message).subscribe(res => {
      if (res.result.status === 'done') { // success
        this.notifier.showSuccess('Your message has been sent correctly', 'Notification');
        this.getUserMessages();
        this.selectedTime = undefined;
        this.messageForm.controls['message'].setValue('');
      } else { // error
        this.notifier.showError('Error during submit of your message', 'Notification')
      }
    });
  }

  /**
   * Get users messages filtered by some time
   * user can choices to get messages in the last
   * 6 hours, 12 hours and 24 hours
   * @param time Time selected by user
  */
  public getUserMessagesFiltred(time: string) {
    if (time.indexOf('24') !== -1) { // last 24 hours
      this.updateUsersMessagesByTimestamp(24);
      localStorage.setItem('selectedTimeOfTchat', JSON.stringify(24));
    } else if (time.indexOf('12') !== -1) { // last 12 hours
      this.updateUsersMessagesByTimestamp(12);
      localStorage.setItem('selectedTimeOfTchat', JSON.stringify(12));
    } else if (time.indexOf('6') !== -1) { // last 6 hours
      this.updateUsersMessagesByTimestamp(6);
      localStorage.setItem('selectedTimeOfTchat', JSON.stringify(6));
    } else if (time.indexOf('All') !== - 1) { // all messages
      this.updateUsersMessagesByTimestamp(0);
      localStorage.setItem('selectedTimeOfTchat', JSON.stringify(0));
    } else {
      throw new Error('Case not implemented');
    }
  }

  /**
   * Update the new users messages which are subtracted by the user's choice hours
   * @param time Time to subtract
   */
  public updateUsersMessagesByTimestamp(time: number) {
    this.tchatService.getMessagesList(this.userStorage.token, 0).subscribe(res => {
      if (res.result.status === 'done') { // success
        // current timestamp like 1617272718291
        const currentTimestamp = String(Date.now());

        // delete three last numbers of the timestamp
        // api return a timestamp with 10 numbers and not 13
        const timestampAround = currentTimestamp.substr(0, currentTimestamp.length - 3);

        // subtracted current timestamp by seconds
        const timestampToCompare = (Number(timestampAround) - (time * 3600));

        // users messages updated
        const newArray = [];

        // loop through the array returned by api and updtate users messages array
        res.result.talk.forEach(x => {
          if (time === 0) { // all messages
            if (x.timestamp <= timestampToCompare) { newArray.push(x) }
          } else { // other cases --> 24, 12, 6, ...
            if (x.timestamp >= timestampToCompare) { newArray.push(x) };
          }
        })

        // update users messages
        this.userMessages = this.sortByAsc(newArray);

        if (time !== 0) { // all cases without "all messages" --> 24, 12, 6, etc ...
          this.notifier.showSuccess(`Users messages has been display by last ${time} hours`, 'Notification');
        } else { // case "all messages"
          this.notifier.showSuccess('All users messages are displayed', 'Notification');
        }
      } else { // error
        this.notifier.showError(`Error during getting users messages by last ${time} hours`, 'Notification');
      }
    });
  }

}
