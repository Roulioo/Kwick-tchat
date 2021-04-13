import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class TchatService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get list of user messages
   * Timestamp with 0 value return all users messages
   * @param token Token of user
   * @param timestamp Time of posted messages
   */
  getMessagesList(token: string, timestamp: number): Observable<any> {
    return this.httpClient.get(`http://greenvelvet.alwaysdata.net/kwick/api/talk/list/${token}/${timestamp}`);
  }

  /**
   * Send user message
   * @param token Token of user
   * @param userId Id of user
   * @param message Message of user
   */
  sendUserMessage(token: string, userId: number, message: string): Observable <any> {
    const messageEncoded = encodeURI(message);

    return this.httpClient.get(`http://greenvelvet.alwaysdata.net/kwick/api/say/${token}/${userId}/${messageEncoded}`);
  }
}
