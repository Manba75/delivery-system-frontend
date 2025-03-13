import { Component, OnInit ,HostListener  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-dpartnerdashboard',
  templateUrl: './dpartnerdashboard.component.html',
  styleUrls: ['./dpartnerdashboard.component.css']
})
export class DpartnerdashboardComponent implements OnInit {
  isModalOpen = false;
  selectedOrder: any = null;
  statusForm: FormGroup;
  getStatusClass (status: string): string {
    switch (status) {
      case 'Delivered': return 'delivered';
      case 'Pending': return 'pending';
      case 'In Progress': return 'in-progress';
      default: return '';
    }
  }
  orders = [
    { request: "Jerome Bell", orderDate: "Apr 25, 2020", customer: "Vbhcde bdeelll", pickupaddress: "Ahmedabad", dropaddress: "Ahmedabad", status: "Delivered", totalCharge: 5000 },
    { request: "John Doe", orderDate: "Apr 26, 2020", customer: "Alice", pickupaddress: "Surat", dropaddress: "Mumbai", status: "Pending", totalCharge: 7000 },
  ];
  constructor() {
    // ✅ Initialize form with default value
    this.statusForm = new FormGroup({
      status: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  openEditModal(order: any) {
    console.log("Opening modal for order:", order);
    this.selectedOrder = { ...order };
    this.statusForm.patchValue({ status: this.selectedOrder.status });  // ✅ Set form value
    this.isModalOpen = true;

    console.log("Modal status:", this.isModalOpen);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateOrderStatus() {
    if (this.selectedOrder) {
      const index = this.orders.findIndex(o => o.request === this.selectedOrder.request);
      if (index !== -1) {
        this.orders[index].status = this.statusForm.value.status;  // ✅ Get value from form
      }
    }
    this.closeModal();
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-profile')) {
      this.isDropdownOpen = false;
    }
  }

}

