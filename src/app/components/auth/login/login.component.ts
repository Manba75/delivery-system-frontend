import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../../../utils/notification/notification.component';
import { LocationService } from '../../../services/location.service';
import { WebsocketserviceService } from '../../../services/websocketservice.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  public loginForm!: FormGroup;
  public userType: string = 'customer';
  public loading = false;
  public submitted = false;

  constructor(private route: ActivatedRoute,private fb: FormBuilder,private authservice: AuthService,private router: Router,private cookieservice: CookieService,private locationservice: LocationService ,private websocketservice :WebsocketserviceService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,Validators.minLength(10),Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,4}$'), this.lowercaseValidator]],
      password: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$')]],
    });
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginForm.patchValue({ email: params['email'] });
      }
    });
  }
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async login() {
    this.submitted = true;
    this.loading = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    try {
      const position = await this.locationservice.getUserLocation();
      const latitude: number = position.latitude;
      const longitude: number = position.longitude;

      console.log("User Location:", { latitude, longitude });

      this.locationservice.getFullAddress(latitude, longitude).subscribe(
        (response) => {
          if (response.error) {
            console.error("Address Error:", response.message);
            this.loading = false;
            return;
          }

          const userData = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
            latitude: String(latitude) || "0",
            longitude: String(longitude) || "0",
            city: response.data.city || "Unknown",
            flatno: response.data.flatno || "N/A",
            street: response.data.street || "N/A",
            landmark: response.data.landmark || "N/A",
            pincode: response.data.pincode || "000000",
            state: response.data.state || "Unknown",
          };

          const verifyApi = this.userType === 'customer' ?
            this.authservice.customerLogin(userData) :
            this.authservice.dpartnerLogin({
              email: this.loginForm.value.email,
              password: this.loginForm.value.password
            });

          verifyApi.subscribe({
            next: (response) => {
              if (response && response.status_code === "1") {
                localStorage.setItem('userType', this.userType);

                const tokenKey = `${this.userType}_token`;
                localStorage.setItem(tokenKey, response.data.token);
                this.cookieservice.set(tokenKey, response.data.token, { path: "/", secure: true, sameSite: "Lax" });

               
                let user = this.userType === 'customer' ? response.data.user : response.data.dpartner;
                console.log("User:", user);
                localStorage.setItem('user', JSON.stringify(user));

                if (this.userType === 'customer' && user.id) {

                  this.websocketservice.logincustomer(user.id);
                }
                if (this.userType === 'dpartner' && user.id) {

                  this.websocketservice.logindpartner(user.id);
                }

                this.notification.showMessage(response.status_message, 'success');

                setTimeout(() => {
                  this.router.navigate([`${this.userType}/dashboard`]);
                }, 1000);
              } else {
                this.notification.showMessage(response.status_message, 'error');
              }
            },
            error: (err) => {
              console.error("API Error:", err);
              this.notification.showMessage("Internal server error", 'error');
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            }
          });
        },
        (error) => {
          console.error("Address fetch error:", error);
          this.loading = false;
        }
      );
    } catch (error) {
      console.error("Location error:", error);
      this.loading = false;
    }
  }

   private lowercaseValidator(control: AbstractControl): ValidationErrors | null {
      const value = control.value || '';
      return /[a-z]/.test(value) ? null : { lowercase: true };
    }

}
