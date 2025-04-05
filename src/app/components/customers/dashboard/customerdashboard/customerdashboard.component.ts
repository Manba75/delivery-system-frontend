import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { orderService } from '../../../../services/order.service';
import { WebsocketserviceService } from '../../../../services/websocketservice.service';
import { NotificationComponent } from '../../../../utils/notification/notification.component';

@Component({
  selector: 'app-customerdashboard',
  templateUrl: './customerdashboard.component.html',
  styleUrls: ['./customerdashboard.component.css']
})
export class CustomerdashboardComponent implements OnInit  {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  orders: any[] = [];
  paginatedOrders: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  userid :number | null =null
  searchText: string = '';
  filteredOrders: any[] = []; 
  constructor(private orderservice: orderService, private websocketservice: WebsocketserviceService) { }

  ngOnInit(): void {
    this.getOrders();
    let user =localStorage.getItem('user');
    if(user){
      let userData = JSON.parse(user);
      this.userid = userData.id;
      if(this.userid !== null){
        this.websocketservice.logincustomer(this.userid);
      }
    }
    this.listenForStatusUpdates();
   
  }
 

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'delivered';
      case 'Pending': return 'pending';
      case 'Accepted': return 'accepted'
      case 'In Progress': return 'in-progress';
      default: return '';
    }
  }


  getOrders() {
    this.loading = true;
    this.orderservice.getcustomerOrders().subscribe({
      next: (response) => {
        if (response && response.status_code === '1' && Array.isArray(response.data)) {
          this.orders = response.data.sort((a, b) => {
            // Accepted orders first
            if (a.order_status === 'accepted' && b.order_status !== 'accepted') return -1;
            if (a.order_status !== 'accepted' && b.order_status === 'accepted') return 1;


            return 0;
          });

          console.log("Orders Fetched:", this.orders);
          this.calculatePagination();
        }
      },
      error: (error) => {
        console.error("Error fetching orders:", error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // acceptOrder(order: any) {
  //   this.orderservice.acceptOrder({ orderId: order.id }).subscribe({
  //     next: (response: any) => {
  //       if (response && response.status_code === '1') {
  //         console.log(" Order Accepted:", response);
  //         this.notification.showMessage("Order accepted successfully!", 'success');
  //         this.loading = false;

  //         order.order_status = 'accepted';
  //         this.websocketservice.orderAccepted(order);
  //         this.listenForStatusUpdates();
  //         this.sortOrders();
  //       }
  //     },
  //     error: () => console.error("Failed to accept order")
  //   });
  // }


  listenForStatusUpdates() {


    this.websocketservice.listenOrderStatusUpdate().subscribe((data: any) => {
      this.orders = this.orders.map(order => {
        if (order.id === data.orderdata.id) {
          order.order_status = data.orderdata.order_status;
        }
        return order;
      });


      this.sortOrders();
    });
  }


  sortOrders() {
    this.orders.sort((a, b) => {
      if (a.order_status === 'accepted' && b.order_status !== 'accepted') return -1;
      if (a.order_status !== 'accepted' && b.order_status === 'accepted') return 1;



      return 0;
    });

    this.calculatePagination();
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

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateOrders();
    }
  }
  onSearch(): void {
    const keyword = this.searchText.toLowerCase().trim();
    if (!keyword) {
      
      this.filteredOrders = [...this.paginatedOrders];
    } else {
     
      this.filteredOrders = this.orders.filter(order =>
        (order.order_title?.toLowerCase().includes(keyword)) ||
        (order.order_status?.toLowerCase().includes(keyword))
      );
    }
  }
}
