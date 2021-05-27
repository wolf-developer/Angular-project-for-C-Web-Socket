import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public webSocketService: WebSocketService) {}
  ngOnInit() {
    // Connect to web socket server

    this.webSocketService.establishWebsocketConnection();
  }
}
