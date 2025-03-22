import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import {io} from 'socket.io-client'; // Import socket.io client
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  private socket: any;
 private baseurl = environment.apibaseURL;


  constructor() {
    this.socket = io(this.baseurl); // Connect to Socket.io server
  }
}
