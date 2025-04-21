import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketserviceService {
  private socket!: Socket;
  private apiUrl = "http://localhost:8000";

  private newOrderSubject = new BehaviorSubject<any>(null);
  private orderAcceptedSubject = new BehaviorSubject<any>(null);
  private orderStatusSubject = new BehaviorSubject<any>(null);

  orderAccepted$ = this.orderAcceptedSubject.asObservable();
  orderStatusUpdates$ = this.orderStatusSubject.asObservable();

  private userId: number | null = null;
  private userType: 'customer' | 'dpartner' | null = null;

  constructor() {
    this.connect();
  }

  /**
   * Establish WebSocket Connection
   */
  private connect() {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(this.apiUrl, {
        reconnection: true,
        reconnectionAttempts: 10
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket:', this.socket.id);
        this.reRegisterUser();
      });

      // Listen for new order event
      this.socket.on("new_order", (orderData: any) => {
        console.log("New Order Received:", orderData);
        if (this.userType === 'dpartner') {
          this.newOrderSubject.next(orderData);
        }
      });

      // Listen for order accepted event
      this.socket.on("order_accepted", (updatedOrder: any) => {
        console.log("Order Accepted:", updatedOrder);
        this.orderAcceptedSubject.next(updatedOrder);
      });

      // Listen for order status update event
      this.socket.on("update_order_status", (data: any) => {
        this.orderStatusSubject.next(data);
      });

      this.socket.on('connect_error', (error) => {
        console.error(' WebSocket Connection Error:', error);
      });

      this.socket.on('disconnect', () => {
        console.warn('WebSocket Disconnected! Retrying...');
        setTimeout(() => {
          this.connect();
        }, 1000);
      });
    }
  }

  /**
   * Register customer socket ID on login
   */
  logincustomer(id: number) {
    this.userId = id;
    this.userType = 'customer';
    if (this.socket?.connected) {
      this.socket.emit("register_customer", { id });
    }
  }

  /**
   * Register delivery partner and join "available_partners" room
   */
  logindpartner(id: number) {
    this.userId = id;
    this.userType = 'dpartner';
    if (this.socket?.connected) {
      this.socket.emit("register_dpartner", { id });
    }
  }

  /**
   * Place an order
   */
  orderPlaced(orderData: any) {
    if (this.socket?.connected) {
      console.log("🚀 Placing Order:", orderData);
      this.socket.emit("order_placed", orderData);
    } else {
      console.error(" WebSocket not connected. Order could not be placed.");
    }
  }

  /**
   * Accept an order (For Delivery Partner)
   */
  orderAccepted(orderData: any) {
    if (this.socket?.connected) {
      console.log(" Accepting Order:", orderData);
      this.socket.emit("order_accepted", orderData);
    } else {
      console.error(" WebSocket not connected. Cannot accept order.");
    }
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderData: any) {
    if (this.socket?.connected) {
      console.log(" Updating Order Status:", orderData);
      this.socket.emit("order_update_status", orderData);
    } else {
      console.error(" WebSocket not connected. Cannot update order status.");
    }
  }

  /**
   * Get new order updates as observable
   */
  getNewOrderUpdates(): Observable<any> {
    return this.newOrderSubject.asObservable();
  }

  /**
   * Listen for order status updates
   */
  listenOrderStatusUpdate(): Observable<any> {
    return this.orderStatusSubject.asObservable();
  }

  /**
   * Re-register user upon reconnection
   */
  private reRegisterUser() {
    if (this.userId && this.userType) {
      if (this.userType === 'customer') {
        this.logincustomer(this.userId);
      } else if (this.userType === 'dpartner') {
        this.logindpartner(this.userId);
      }
    }
  }
    /** Listen for general notifications */ 
    onNewNotification(): Observable<any> {
      return new Observable((observer) => {
        this.socket.on('new_notification', (notification) => {
          observer.next(notification);
        });
      });
    }
}
