import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import {io} from 'socket.io-client'; // Import socket.io client
import { NotificationComponent } from './utils/notification/notification.component';
import { WebsocketserviceService } from './services/websocketservice.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,AfterViewInit {
  title = 'frontend';
  @ViewChild (NotificationComponent) notification!: NotificationComponent;

  // uset

  constructor(private websocketservice :WebsocketserviceService){}

  ngOnInit() {
    let user= localStorage.getItem('user');
    let userType= localStorage.getItem('userType');
    if(user && userType=== 'customer'){
      let userData = JSON.parse(user);
      this.websocketservice.logincustomer(userData.id);
    }
    if(user && userType=== 'dpartner'){
      let userData = JSON.parse(user);
      this.websocketservice.logindpartner(userData.id);
    }



  }
  ngAfterViewInit() {

    this.websocketservice.orderAccepted$.subscribe((data: any) => {
      if (this.notification) {
        this.notification.showMessage(data.message, 'success');
      }
    });

    this.websocketservice.listenOrderStatusUpdate().subscribe((data: any) => {
      if (this.notification) {
        this.notification.showMessage(data.message, 'success');
      }
    });

    this.websocketservice.onNewNotification().subscribe((notificationmsg: any) => {
      if (this.notification) {
        this.notification.showMessage(notificationmsg.message, 'success');
      }
    });
  }
}
