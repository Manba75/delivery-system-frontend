import { Component, OnInit, ViewChild } from '@angular/core';
import { VehicletypeService } from '../../../services/vehicletype.service';
import { LocationService } from '../../../services/location.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../../../utils/notification/notification.component';

@Component({
  selector: 'app-select-vehicletype',
  templateUrl: './select-vehicletype.component.html',
  styleUrls: ['./select-vehicletype.component.css']
})
export class SelectVehicletypeComponent implements OnInit {
  @ViewChild('NotificationComponent') notification!: NotificationComponent;

  public vehicletypes: any[] = [];
  public loading: boolean = false;
  public currentcity: string | null = null;
  public selectedvehicletype: any = null;
  public vehiclecharge: number | null = null;
  public vehicletype_type:string='';
  public isloggedin: boolean = false;
  public vehicledetails: any = null;

  constructor(
    private vehicletypeservice: VehicletypeService,
    private locationservice: LocationService,
    private router: Router,
    private sharedservice: SharedService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSelectedCity();

    // Subscribe to SharedService for order data
    this.sharedservice.orderData$.subscribe((orderData) => {
      console.log("Received order data:", orderData);
      if (orderData.city) {
        this.currentcity = orderData.city;
      }
      if (orderData.vehicletype) {
        this.vehicletype_type = orderData.vehicletype;
        this.vehiclecharge = orderData.charge;
      }
    });
  }

  getVehicleTypes() {
    this.loading = true;
    this.vehicletypeservice.getvehicletypes().subscribe({
      next: (response) => {
        this.vehicletypes = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });
  }

  getCurrentCity() {
    this.locationservice.getUserLocation().then((position) => {
      const latitude: number = position.latitude;
      const longitude: number = position.longitude;
      console.log("User Location:", { latitude, longitude });

      this.locationservice.getFullAddress(latitude, longitude).subscribe({
        next: (response) => {
          this.currentcity = response.data.city;
          this.sharedservice.setOrderData({ city: this.currentcity });
          this.getVehicleTypes();
        },
        error: (error) => {
          console.log(error);
        }
      });
    });
  }

  loadSelectedCity() {
    this.getVehicleTypes();
    const orderData = this.sharedservice.getOrderData();

    if (orderData.city) {
      this.currentcity = orderData.city;
    } else {
      this.getCurrentCity();
    }
  }

  selectTransport(vehicletype: any) {

    this.selectedvehicletype= vehicletype;
    this.vehiclecharge = this.selectedvehicletype.vehicletype_price;
    this.vehicletype_type = this.selectedvehicletype.vehicletype_type;

    this.sharedservice.setOrderData({
      city: this.currentcity,
      vehicletype: this.vehicletype_type,
      charge: this.vehiclecharge

    });
  }

  onCityChange(event: any) {
    this.currentcity = event.target.value;
    this.sharedservice.setOrderData({ city: this.currentcity });
    this.router.navigate(['/order/select-city']);
  }

  getestimate() {
    this.isloggedin = this.authservice.isLoggedIn();

    if (!this.currentcity || !this.selectedvehicletype) {
      this.notification.showMessage("Please select city and vehicle type", 'warning');
      return;
  }

    this.sharedservice.setOrderData({
      city: this.currentcity,
      vehicletype: this.vehicletype_type,
      charge: this.vehiclecharge

    });

    this.isloggedin
      ? this.router.navigate(['/order/select-address'])
      : this.router.navigate(['/customer/login']);
  }
}
