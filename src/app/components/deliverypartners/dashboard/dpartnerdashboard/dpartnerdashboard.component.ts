import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, NgZone, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { WebsocketserviceService } from '../../../../services/websocketservice.service';
import { orderService } from '../../../../services/order.service';
import { NotificationComponent } from '../../../../utils/notification/notification.component';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

enum OrderStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Pickup = 'pickup',
  InProgress = 'in-progress',
  Delivered = 'delivered',
  Rejected = 'rejected'
}

// interface Order {
//   id: number;
//   status: string;
//   order_status: string;
// }

@Component({
  selector: 'app-dpartnerdashboard',
  templateUrl: './dpartnerdashboard.component.html',
  styleUrls: ['./dpartnerdashboard.component.css']
})
export class DpartnerdashboardComponent implements OnInit, OnDestroy {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  orders:any[] = [];
  paginatedOrders: any[] = [];
  deliveryPartnerId: number | null = null;
  private subscriptions: Subscription[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  selectedFilter = new FormControl('today');
  filteredOrders: any[] = [];
  isavailable:boolean=false;
  otp=new FormControl();

  constructor(
    private websocketservice: WebsocketserviceService,
    private orderservice: orderService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private authservice: AuthService,
  ) {
    console.log("DpartnerdashboardComponent initialized");

  }

  ngOnInit(): void {

    this.getDeliveryPartnerId();
    this.fetchOrders();
    if (this.deliveryPartnerId !== null) {
      this.websocketservice.logindpartner(this.deliveryPartnerId);
    } else {
      console.error("Delivery Partner ID is null. Cannot log in.");
    }
    // if(!this.isavailable){
      this.listenForNewOrders();
    // }
   

    setInterval(() => {
      this.fetchOrders();
    }, 10000);


    this.selectedFilter.valueChanges.subscribe((value:any) => {
      this.filterOrders(value);
    });
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getDeliveryPartnerId() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.isavailable = user?.dpartner_isavailable;
        this.deliveryPartnerId = user?.id || null;
      } catch (error) {
        console.error(" Error parsing user data from localStorage:", error);
      }
    }
  }

  fetchOrders() {
    this.loading = true;

    this.orderservice.getorders().subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.status_code === '1' && Array.isArray(response.data)) {


          this.orders = response.data
            .filter((order: any) => order && order.id !== null && order.dpartner_id === this.deliveryPartnerId || order.order_status === OrderStatus.Pending || order.dpartner_id === null || order.order_status !== 'rejected')
            .map((order: any) => ({
              ...order,
              order_status: order.order_status || order.status || OrderStatus.Pending // Standardize order_status
            }))
            .sort((a, b) => {
              const orderStatusPriority: { [key: string]: number } = {
                [OrderStatus.Pending]: 1,
                [OrderStatus.Accepted]: 2,
                [OrderStatus.Pickup]: 3,
                [OrderStatus.InProgress]: 4,
                [OrderStatus.Delivered]: 5,
                [OrderStatus.Rejected]: 6,
              };
              return (orderStatusPriority[a.order_status] || 99) - (orderStatusPriority[b.order_status] || 99);
            });

          this.calculatePagination();

          // console.log("Orders after processing:", this.orders);
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error(' Error fetching orders:', error)
    });
  }


  listenForNewOrders() {
    // this.loading = true;
    const newOrderSub = this.websocketservice.getNewOrderUpdates().subscribe((order: any) => {
      console.log("oo",order)
      this.notification?.showMessage(order.message, 'success');
      if (!order || !order.data || !order.insertResult) return;

      const newOrderId: number = order.insertResult;
      console.log("New Order ID:", newOrderId);

      if (this.orders.some((o: any) => o.id === newOrderId)) return;

      this.ngZone.run(() => {
        const pickupAddress = [
          order.orderData.order_pickup_flatno,
          order.orderData.order_pickup_street,
          order.orderData.order_pickup_landmark,
          order.orderData.order_pickup_city,
          order.orderData.order_pickup_state,
          order.orderData.order_pickup_pincode

        ].filter(Boolean).join(', ');

        const dropAddress = [
          order.orderData.order_drop_landmark,
          order.orderData.order_drop_street,
          order.orderData.order_drop_city,
          order.orderData.order_drop_state,
          order.orderData.order_drop_flatno,
          order.orderData.order_drop_pincode
        ].filter(Boolean).join(', ');


        let cust_name= this.fetchCustomerName(order.orderData.cust_id);

          const newOrder = {
            id: newOrderId,
            cust_name: cust_name,
            order_date: new Date(),
            pickup_address: pickupAddress,
            drop_address: dropAddress,
            order_delivery_charge: order.orderData.order_delivery_charge || 0,
            order_status:order.orderData.order_status || OrderStatus.Pending,

          }
          this.orders.unshift(newOrder);
          this.calculatePagination();
          this.loading = false;
          this.notification?.showMessage('New Order Received!', 'success');


          this.cdr.detectChanges();
        });

      });

    this.subscriptions.push(newOrderSub);
  }



  acceptOrder(order: any) {
    if (!this.deliveryPartnerId) {
      this.notification?.showMessage("Delivery partner ID is missing!", "error");
      return;
    }
    this.loading = true;
    if(order.dpartner_id === null){
      this.orderservice.acceptOrder({ orderId: order.id, dpartnerId: this.deliveryPartnerId }).subscribe({
        next: (response: any) => {
          if (response && response.status_code === '1') {
            this.ngZone.run(() => {
              order.order_status = OrderStatus.Accepted;
              this.notification.showMessage(`Order Accepted! OTP Sent: ${response.data.otp}`, 'success');
  
              // Notify other partners
  
              this.websocketservice.orderAccepted({ id: order.id, cust_id:order.cust_id,dpartnerId: this.deliveryPartnerId, order_status: OrderStatus.Accepted });
  
              this.cdr.detectChanges();
            });
          } else {
            this.notification?.showMessage(response.message, 'error');
          }
        },
        error: () => this.notification?.showMessage("Failed to accept order.", 'error'),
        complete: () => this.loading = false
      });
    }else{
      this.notification?.showMessage("Order already accepted by another partner.", 'error');
    }
 
  }


  updateOrderStatus(order:any, newStatus: string) {
    this.loading = true;
    this.orderservice.orderStatusUpdate({ orderId:order.id , status: newStatus  }).subscribe({
      next: (response: any) => {
        if (response && response.status_code === '1') {
          this.ngZone.run(() => {
            order.order_status = newStatus;
            this.notification.showMessage(` Order status updated to ${newStatus}!`, 'success');
            this.loading = false;
            this.websocketservice.updateOrderStatus({ id: order.id, cust_id:order.cust_id, order_status: newStatus });
            // this.websocketservice.listenOrderStatusUpdate();
            this.cdr.detectChanges();
          });
        } else {
          this.notification?.showMessage(response.status_message, 'error');
        }
      },
      error: () => this.notification?.showMessage("Failed to update order status.", 'error'),
      complete: () => this.loading = false
    });
  }
  rejectOrder(order: any) {
    let newstatus = 'rejected';
    let order_id = order.id;
  
    this.orderservice.orderStatusUpdate({ order_id, newstatus }).subscribe({
      next: (response: any) => {
        if (response.status_code === '1') {
          console.log("Order rejected:", response);
  
          // Update order status
          order.order_status = 'rejected';
  
          // Notify backend via WebSocket
          this.websocketservice.updateOrderStatus({ orderId: order.id, order_status: newstatus });
  
          // Remove the order from the list
          this.orders = this.orders.filter(o => o.id !== order.id);
  
          // Optional: sort again if needed
          this.sortOrders();
        }
      },
      error: () => console.error("Failed to reject order")
    });
    this.notification?.showMessage("Order rejected!", 'success');
    this.loading = false;
   this.updatePaginatedOrders();
  }
  
  sortOrders() {
    throw new Error('Method not implemented.');
  }


  getNextActionText(order: any) {
    switch (order.order_status) {
      case OrderStatus.Pending: return 'accept';
      case OrderStatus.Accepted: return 'pickup';
      case OrderStatus.Pickup: return 'In-Progress';
      case OrderStatus.InProgress: return 'Delivered';
      case OrderStatus.InProgress: return 'rejected';
      default: return '';
    }
  }

  getNextStatus(status: string): string {
    switch (status) {
      case OrderStatus.Accepted: return OrderStatus.Pickup;
      case OrderStatus.Pickup: return OrderStatus.InProgress;
      case OrderStatus.InProgress: return OrderStatus.Delivered;
      case OrderStatus.Pending: return OrderStatus.Accepted;
      case OrderStatus.Rejected: return OrderStatus.Rejected;
      default: return '';
    }
  }

  getStatusClass(order: any) {
    switch (order.order_status) {
      case OrderStatus.Pending: return 'badge badge-warning';
      case OrderStatus.Accepted: return 'badge badge-primary';
      case OrderStatus.Pickup: return 'badge badge-info';
      case OrderStatus.InProgress: return 'badge badge-secondary';
      case OrderStatus.Rejected: return 'badge badge-danger';
      case OrderStatus.Delivered: return 'badge badge-success';
     
      default: return '';
    }
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    this.paginateOrders();
  }

  paginateOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateOrders();
    }
  }
  updatePaginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
  }
  

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateOrders();
    }
  }
  totlePedingOrders() {
    return this.orders.filter(order => order.order_status === OrderStatus.Pending).length;
  }
  totleAcceptedOrders() {
    return this.orders.filter(order => order.order_status === OrderStatus.Accepted).length;
  }
  totaleInProgressOrders() {
    return this.orders.filter(order => order.order_status === OrderStatus.InProgress).length;
  }
  totleDeliveredOrders() {
    return this.orders.filter(order => order.order_status === OrderStatus.Delivered).length;
  }
  totlePickupOrders() {
    return this.orders.filter(order => order.order_status === OrderStatus.Pickup).length;
  }
  filterOrders(filterValue: string) {
    const today = new Date();
    if (filterValue === "today") {
      this.paginatedOrders = this.orders.filter(order =>
        new Date(order.order_date).toDateString() === today.toDateString()
      );
    } else if (filterValue === "last_week") {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      this.paginatedOrders = this.orders.filter(order =>
        new Date(order.order_date) >= lastWeek
      );
    } else if (filterValue === "last_month") {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      this.paginatedOrders = this.orders.filter(order =>
        new Date(order.order_date) >= lastMonth
      );
    }else if(filterValue === "yesterday"){
      const yesterday=new Date();
      yesterday.setDate(today.getDate()-1);
      this.paginatedOrders = this.orders.filter(order =>
        new Date(order.order_date).toDateString() === yesterday.toDateString()
      );
    }else if(filterValue === "all"){
      this.paginateOrders();
    }

  }
  verifyOtp(order:any) {
    if (!this.otp.value) {
      this.notification?.showMessage("Please enter OTP", 'error');
      return;
    }
    let orderId= order.id;
    let otp= this.otp.value;

    this.orderservice.verifyorderotp({orderId,otp}).subscribe({
      next: (response) => {
        if (response && response.status_code === '1') {
          console.log("otp",response.data);
          this.notification?.showMessage("OTP Verified!", 'success');
          order.order_status = OrderStatus.InProgress;

          this.updateOrderStatus(order, OrderStatus.InProgress);
          // this.websocketservice.orderStatusUpdates$({ id: order.id, status: OrderStatus.InProgress });

        } else {
          this.notification?.showMessage(response.status_message, 'error');
        }
      },
      error: () => this.notification?.showMessage("Failed to verify OTP.", 'error')

    })

    }

    fetchCustomerName(custId: number) {
      this.authservice.getCustomerById().subscribe({
        next: (response) => {
          if (response && response.status_code === '1') {
            const customer = response.data.find((cust: any) => cust.id === custId);
            return customer ? customer.cust_name : 'Unknown Customer';
          } else {
            console.error('Error fetching customer name:', response.status_message);
            return 'Unknown Customer';
          }
        },
        error: (error) => {
          console.error('Error fetching customer name:', error);
          return 'Unknown Customer';
        }
      })
     }



}

