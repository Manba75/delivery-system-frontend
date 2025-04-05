import { Component, OnInit } from '@angular/core';
import { CityService } from '../../../services/city.service';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.css']
})
export class SelectCityComponent implements OnInit {
  public cities: any[] = [];
  public loading: boolean = false;
  public selectedcity: any = null;

  constructor(
    private cityservice: CityService,
    private sharedservice: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCities();

    // Subscribe to order data changes
    this.sharedservice.orderData$.subscribe((data) => {
      if (data.city) {
        this.selectedcity = data.city;
      }
    });
  }

  getCities() {
    this.loading = true;
    this.cityservice.getCities().subscribe({
      next: (response) => {
        this.cities = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });
  }

  selectcity(city: any) {
    this.selectedcity = city;
    console.log('Selected City:', this.selectedcity);

    // Update SharedService with selected city
    this.sharedservice.setOrderData({ city: city.city_name });

    // Navigate to select vehicle type page
    this.router.navigate(['/order/select-vehicletype']);
  }
}
