import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  public isAuth: boolean;

  constructor(private httpClient: HttpClient) { }

  /**
   * Create user account
   * @param userName Name of user
   * @param password Password of user
   */
  signUp(userName: string, password: string): Observable<any> {
    return this.httpClient.get(`http://greenvelvet.alwaysdata.net/kwick/api/signup/${userName}/${password}`);
  }

  /**
   * Sign in the user account
   * @param userName Name of user
   * @param password Password of user
   */
  signIn(userName: string, password: string): Observable<any> {
    return this.httpClient.get(`http://greenvelvet.alwaysdata.net/kwick/api/login/${userName}/${password}`);
  }

  /**
   * Logout user account
   * @param token Token of user
   * @param userId Id of user
   */
  logout(token: string, userId: number): Observable<any> {
    return this.httpClient.get(`http://greenvelvet.alwaysdata.net/kwick/api/logout/${token}/${userId}`);
  }

}
