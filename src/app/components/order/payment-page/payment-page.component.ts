import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { orderService } from '../../../services/order.service';
import { SharedService } from '../../../services/shared.service';
import { WebsocketserviceService } from '../../../services/websocketservice.service';
import { NotificationComponent } from '../../../utils/notification/notification.component';
import { query } from '@angular/animations';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  orderdetails: any = {};
  loading: boolean = false;
  orderId!: number;
   userid : number | null = null;
  constructor(
    private shareservice: SharedService,
    private orderservice: orderService,
    private router: Router,
    private websocketservice: WebsocketserviceService
  ) {}

  ngOnInit(): void {
    // console.log("PaymentPageComponent initialized");
    this.orderdetails = this.shareservice.getOrderData();
    console.log("Order details:", this.orderdetails);
     let user= localStorage.getItem('user');
     if(user){
      let userData = JSON.parse(user);
      this.userid = userData.id;
     if(this.userid !== null){
       this.websocketservice.logincustomer(this.userid);
     }
     }
     this.websocketservice.orderAccepted$.subscribe((acceptedOrder) => {
      console.log("Order Accepted Event Received:", acceptedOrder);
      this.notification.showMessage("Order accepted!", 'success');


      if (acceptedOrder && acceptedOrder.orderData.id === this.orderId) {
        this.loading = false;
        this.router.navigate(["/customer/dashboard"]);

      }
    });
    this.websocketservice.listenOrderStatusUpdate();





  }

  orderplace() {
    if (!this.orderdetails || Object.keys(this.orderdetails).length === 0) {
      this.notification.showMessage("Order details are missing", 'error');
      return;
    }

    console.log("Placing order with details:", this.orderdetails);

    this.loading = true;
    this.orderservice.placeorder(this.orderdetails).subscribe({
      next: (response) => {

        console.log('Order placement response:', this.orderdetails);
        console.log('Order placed successfully:', response);

        if (response.status_code === '1' && response.data) {

          this.orderId = response.data.insertResult ;


          this.websocketservice.orderPlaced(response.data);
          this.notification.showMessage("Order placed successfully! Waiting for a delivery partner.", 'success');

        } else {
          this.notification.showMessage("Order placement failed!", 'error');
          this.loading = false;
        }


      },
      error: (error) => {
        console.error('Order placement failed:', error);
        this.notification.showMessage("Order failed! Please try again.", "error");
        this.loading = false;
      }
    });
  }

}
