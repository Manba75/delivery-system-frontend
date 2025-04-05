import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { LocationService } from '../../../../services/location.service'; // ✅ Import LocationService
import { NotificationComponent } from '../../../../utils/notification/notification.component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.css']
})
export class CustomerprofileComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  profileForm!: FormGroup;
  userdata: any = {};
  latitude!: string;
  longitude!: string;
  public isSubmitted: boolean = false;
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private locationService: LocationService // ✅ Inject LocationService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      cust_email: [{ value: '', disabled: true }],
      cust_name: ['', Validators.required],
      cust_phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      street: ['', Validators.required],
      landmark: ['', Validators.required],
      flatno: ['', Validators.required],
      city_name: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    this.getuserdetails();

    // ✅ Auto-fetch coordinates when the address changes
    this.profileForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => this.fetchCoordinates());
    this.getuserdetails();
  }

  getuserdetails() {
    this.loading = true;
    this.authservice.getUserDetails().subscribe({
      next: (response) => {
        if (response && response.status_code === '1') {
          this.userdata = response.data;
          this.profileForm.patchValue(this.userdata);
          this.loading = false;
        }
      }
    });
  }

  fetchCoordinates() {
    const address = `${this.profileForm.get('landmark')?.value}, ${this.profileForm.get('street')?.value}, ${this.profileForm.get('flatno')?.value}, ${this.profileForm.get('city_name')?.value}, ${this.profileForm.get('pincode')?.value}`;
    console.log("Formatted Address for API:", address);

    if (!address.trim()) return;

    this.locationService.getCoordinates(address).subscribe({
      next: (data) => {
        console.log("Location res",data)
        if (data.length > 0) {
          const location = data[0];
          this.latitude = location.lat;
          this.longitude = location.lon;
          console.log(`Updated Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
        } else {
          console.warn('Invalid address or not found.');
        }
      },
      error: (error) => console.error('Error fetching coordinates:', error)
    });
  }

  updateprofile() {
    this.isSubmitted = true;

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedData = {
      ...this.profileForm.value,
      latitude: this.latitude, 
      longitude: this.longitude 
    };

    this.authservice.updateUserprofile(updatedData).subscribe({
      next: (response) => {
        this.loading = true;
        console.log("response", response);

        if (response && response.status_code === '1') {
          this.notification.showMessage(response.status_message, 'success');
          this.getuserdetails();
        } else {
          this.notification.showMessage(response.status_message, 'error');
        }
      },
      error: (error) => {
        this.notification.showMessage(error.error.status_message, 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
