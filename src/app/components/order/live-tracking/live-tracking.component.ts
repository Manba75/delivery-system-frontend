import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
// import { LocationService } from '../../../../services/location.service';
import { orderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { query } from '@angular/animations';

@Component({
  selector: 'app-live-tracking',
  templateUrl: './live-tracking.component.html',
  styleUrls: ['./live-tracking.component.css']
})
export class LiveTrackingComponent implements OnInit {
  map!: L.Map;
  pickupMarker!: L.Marker;
  dropMarker!: L.Marker;
  center = { lat: 22.5726, lng: 88.3639 }; // Default center
  finalpickupaddress: string = '';
  finaldropaddress: string='';
  pickup_latitude: number = 0;
  pickup_longitude: number = 0;
  drop_latitude: number = 0;
  drop_longitude: number = 0;
  mapInitialized: boolean = false;
  orderid: number | null = null;
  constructor(private orderservice: orderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMap();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderid = +id; // convert string to number
        console.log("Order ID:", this.orderid);
        this.fetchOrderDetails(this.orderid);
      }
    });
  }

  initMap() {
    if (this.mapInitialized) return;

    this.map = L.map('map').setView([this.center.lat, this.center.lng], 13);
    this.mapInitialized = true;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.pickupMarker = L.marker([this.pickup_latitude,this.pickup_longitude], { draggable: false }).addTo(this.map)
      .bindPopup(this.finalpickupaddress).openPopup();

    this.dropMarker = L.marker([this.drop_latitude +0.01, this.drop_longitude], { draggable: false }).addTo(this.map)
      .bindPopup(this.finaldropaddress).openPopup();

    // this.pickupMarker.on('dragend', (event: any) => this.updatePickupLocation(event.target.getLatLng()));
    // this.dropMarker.on('dragend', (event: any) => this.updateDropLocation(event.target.getLatLng()));
  }

  // get lat and long from address
 fetchOrderDetails(orderId: number) {
    this.orderservice.getOrderbyId(orderId).subscribe({
      next: (response) => {
        if (response && response.status_code === '1') {
          this.pickup_latitude = response.data.order_pickup_latitude;
          this.pickup_longitude = response.data.order_pickup_longitude;
          this.drop_latitude = response.data.order_drop_latitude;
          this.drop_longitude = response.data.order_drop_longitude;
          this.finalpickupaddress = [response.data.order_pickup_flatno,response.data.order_pickup_street,response.data.order_pickup_landmark,response.data.order_pickup_city,response.data.order_pickup_state,response.data.order_pickup_pincode].filter(Boolean).join(', ');
          this.finaldropaddress = [response.data.order_drop_flatno,response.data.order_drop_street,response.data.order_drop_landmark,response.data.order_drop_city,response.data.order_drop_state,response.data.order_drop_pincode].filter(Boolean).join(', ');
          console.log("Pickup Address:", this.finalpickupaddress);
          console.log("Drop Address:", this.finaldropaddress);
        }
      },
      error: (error) => {
        console.error('Error fetching order data:', error);
      }

    })
  }
}
