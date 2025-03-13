import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customerdashboard',
  templateUrl: './customerdashboard.component.html',
  styleUrls: ['./customerdashboard.component.css']
})
export class CustomerdashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  // isSidebarOpen = false;

  // toggleSidebar() {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }

  orders = [
    { customer: "Jerome Bell", orderDate: "Apr 25, 2020", partner: "Vbhcde bdeelll", address: "Ahmedabad", status: "Delivered", totalCharge: 5000 },
    { customer: "Jerome Bell", orderDate: "Apr 25, 2020", partner: "Vbhcde bdeelll", address: "Ahmedabad", status: "Pending", totalCharge: 5000 },
    { customer: "Jerome Bell", orderDate: "Apr 25, 2020", partner: "Vbhcde bdeelll", address: "Ahmedabad", status: "In Progress", totalCharge: 5000 },
    { customer: "Jerome Bell", orderDate: "Apr 25, 2020", partner: "Vbhcde bdeelll", address: "Ahmedabad", status: "Delivered", totalCharge: 5000 },
    { customer: "Jerome Bell", orderDate: "Apr 25, 2020", partner: "Vbhcde bdeelll", address: "Ahmedabad", status: "Pending", totalCharge: 5000 },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'delivered';
      case 'Pending': return 'pending';
      case 'In Progress': return 'in-progress';
      default: return '';
    }
  }

}
