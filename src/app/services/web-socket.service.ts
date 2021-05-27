import { Injectable, OnDestroy } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import {
  filter,
  map,
  switchMap,
  retryWhen,
  delay,
  takeUntil,
} from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  destroyed = new Subject();
  connection: WebSocketSubject<any>;
  retry_seconds = 10;
  server_url = '35.214.86.192';
  // server_url = 'localhost:8060';
  constructor() {}
  establishWebsocketConnection(): {} {
    let response: any;
    this.interact()
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        console.log(res);
        response = res;
      });
    return response;
  }
  interact(): Observable<any> {
    return of(`https://${this.server_url}`).pipe(
      filter((apiUrl) => !!apiUrl),
      // https becomes wss, http becomes ws
      map((apiUrl) => apiUrl.replace(/^http/, 'ws')),
      switchMap((wsUrl) => {
        if (this.connection) {
          return this.connection;
        } else {
          this.connection = webSocket(wsUrl);
          return this.connection;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(this.retry_seconds)))
    );
  }
  sendData(data: any): void {
    if (this.connection) {
      console.log('request', data);
      this.connection.next(data);
    } else {
      console.error('Did not send data, open a connection first');
    }
  }
  closeConnection(): void {
    if (this.connection) {
      this.connection.complete();
      this.connection = null;
    }
  }
  ngOnDestroy(): void {
    this.closeConnection();
  }
}
