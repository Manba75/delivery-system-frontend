import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  message: string = '';
  type: 'success' | 'error' |'warning' = 'success';
  visible: boolean = false;

  showMessage(msg: string, type: 'success' | 'error' |'warning' = 'success') {
    this.message = msg;
    this.type = type;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 4000); // Hide after 4 seconds
  }
}

