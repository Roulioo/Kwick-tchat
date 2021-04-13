import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get users logged
   * @param token Token of user
   */
  getUsersLogged(token: string): Observable<any> {
    return this.httpClient.get(`http://greenvelvet.alwaysdata.net/kwick/api/user/logged/${token}`);
  }

}
