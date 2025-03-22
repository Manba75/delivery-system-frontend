import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../../../utils/notification/notification.component';

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private cookieservice: CookieService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$')
      ]],
    });
  }

  login() {
    this.submitted = true;
    this.loading = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    let userData = this.loginForm.value;
    let verifyAPI = this.userType === 'customer'
      ? this.authservice.customerLogin(userData)
      : this.authservice.dpartnerLogin(userData);

    verifyAPI.subscribe({
      next: (response) => {
        if (response && response.status_code === "1") {
          const token = response.data.token;
          console.log("t", token);
          let user = response.data.user.user;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.cookieservice.set('authToken', token, { expires: 7, path: '/' });

            this.notification.showMessage(response.status_message, 'success');
            this.loginForm.reset();

            setTimeout(() => {
              this.router.navigate([`${this.userType}/dashboard`]);
            }, 1000);
          }
          // else {
          //   // Navigate to verify-email page
          //   this.notification.showMessage("User not verified. Redirecting to verification...", 'error');

          //   setTimeout(() => {
          //     this.router.navigate([`${this.userType}/verify-email`]);
          //   }, 1000);
          // }
      //  }
        else {
          this.notification.showMessage(response.status_message, 'error');
        }
      },
      error: () => {
        this.notification.showMessage("Something went wrong", 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


}
