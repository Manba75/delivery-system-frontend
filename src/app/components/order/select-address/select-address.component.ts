import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { SharedService } from '../../../services/shared.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.css']
})
export class SelectAddressComponent implements OnInit {
  addressForm!: FormGroup;
  map!: L.Map;
  pickupMarker!: L.Marker;
  dropMarker!: L.Marker;
  center = { lat: 22.5726, lng: 88.3639 }; // Default center
  finalpickupaddress: any = {};
  finaldropaddress: any = {};
  selectedCity: string = "";
  mapInitialized: boolean = false;
  issubmitted: boolean = false;
  loading: boolean = false;

  @ViewChild('pickupInput') pickupInput!: ElementRef;
  @ViewChild('dropInput') dropInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private shareService: SharedService,
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.addressForm = this.fb.group({
      pickupAddress: ['', Validators.required],
      pickupPhone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      dropAddress: ['', Validators.required],
      dropPhone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]]
    });

    this.shareService.orderData$.subscribe(orderData => {
      if (orderData.city) {
        this.selectedCity = orderData.city;
        this.getCityCoordinates(this.selectedCity);
      } else {
        this.locationService.getUserLocation().then(userLocation => {
          console.log("User Location:", userLocation);
          this.center = { lat: userLocation.latitude, lng: userLocation.longitude };
          this.initMap();
        }).catch(error => {
          console.error("Error fetching user location:", error);
        });
      }
    });
  }

  getCityCoordinates(city: string) {
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
      .subscribe((response: any) => {
        if (response.length > 0) {
          this.center = { lat: parseFloat(response[0].lat), lng: parseFloat(response[0].lon) };
          this.initMap();
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

    this.pickupMarker = L.marker([this.center.lat, this.center.lng], { draggable: true }).addTo(this.map)
      .bindPopup("Pickup Location").openPopup();

    this.dropMarker = L.marker([this.center.lat , this.center.lng], { draggable: true }).addTo(this.map)
      .bindPopup("Drop Location").openPopup();

    this.pickupMarker.on('dragend', (event: any) => this.updatePickupLocation(event.target.getLatLng()));
    this.dropMarker.on('dragend', (event: any) => this.updateDropLocation(event.target.getLatLng()));
  }

  updatePickupLocation(position?: { lat: number; lng: number }) {
    let address = this.addressForm.value.pickupAddress;

    if (address) {
      this.locationService.getLatLngFromAddress(address).subscribe((coord:any) => {
        if (!coord || ('error' in coord && coord.error)) return;
        this.processPickupLocation({ lat: coord.lat, lng: coord.lng }, address);
      });
    } else if (position) {
      this.locationService.getFullAddress(position.lat, position.lng).subscribe(data => {
        if (data.error) return;
        this.processPickupLocation(position, data.data.fullAddress);
      });
    }
  }

  private processPickupLocation(position: { lat: number; lng: number }, fullAddress: string) {
    if (!position) return;

    this.pickupMarker.setLatLng([position.lat, position.lng]).bindPopup(fullAddress);

    this.locationService.getFullAddress(position.lat, position.lng).subscribe(data => {
      if (data.error) return;
      if (data.data.city !== this.selectedCity) {
        alert(`Pickup must be within ${this.selectedCity} city.`);
        return;
      }

      this.finalpickupaddress = { ...data.data, phone: this.addressForm.value.pickupPhone };
      this.ngZone.run(() => this.addressForm.patchValue({ pickupAddress: fullAddress }));
      this.shareService.setOrderData({ pickup: this.finalpickupaddress });
    });
  }

  updateDropLocation(position?: { lat: number; lng: number }) {
    let address = this.addressForm.value.dropAddress;

    if (address) {
      this.locationService.getLatLngFromAddress(address).subscribe((coord:any) => {
        if (!coord || coord.error) return;
        this.processDropLocation({ lat: coord.lat, lng: coord.lng }, address);
      });
    } else if (position) {
      this.locationService.getFullAddress(position.lat, position.lng).subscribe(data => {
        if (data.error) return;
        this.processDropLocation(position, data.data.fullAddress);
      });
    }
  }

  private processDropLocation(position: { lat: number; lng: number }, fullAddress: string) {
    if (!position) return;

    this.dropMarker.setLatLng([position.lat, position.lng]).bindPopup(fullAddress);

    this.locationService.getFullAddress(position.lat, position.lng).subscribe(data => {
      if (data.error) return;
      if (data.data.city !== this.selectedCity) {
        alert(`Drop must be within ${this.selectedCity}.`);
        return;
      }

      this.finaldropaddress = { ...data.data, phone: this.addressForm.value.dropPhone };
      this.ngZone.run(() => this.addressForm.patchValue({ dropAddress: fullAddress }));
      this.shareService.setOrderData({ drop: this.finaldropaddress });
    });
  }

  confirmAddress() {
    this.issubmitted = true;
    this.loading = true;
    if(this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.finalpickupaddress.phone = this.addressForm.value.pickupPhone;
    this.finaldropaddress.phone = this.addressForm.value.dropPhone;
    this.shareService.setOrderData({ pickup: this.finalpickupaddress, drop: this.finaldropaddress });
    this.router.navigate(['/order/payment']);
  }
}
