import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public webSocketService: WebSocketService) {}
  destroyed = new Subject();

  ngOnInit(): void {
    this.webSocketService
      .interact()
      .pipe(takeUntil(this.destroyed))
      .subscribe((res) => {
        console.log('response', res);
      });
  }
  sendData(): void {
    const msg = {
      action: 'authRequest',
      username: 'arif',
      msg: {
        client: 'bp',
        data: 'some data',
      },
    };
    this.webSocketService.sendData(msg);
  }
  ngOnDestroy(): void {
    this.destroyed.next();
  }
}
