import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../../../utils/notification/notification.component';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  public userType: string = 'customer';
  public submitted: boolean = false;
  public resetpasswordform!: FormGroup;
  public loading = false;
  public token = '';
  public email = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ? decodeURIComponent(params['token']) : '';  // Decode token
      this.email = params['email'] ? decodeURIComponent(params['email']) : '';

      if (!this.token || !this.email) {
        this.notification?.showMessage("Invalid or missing token/email", 'error');
      }
    });

    this.resetpasswordform = this.fb.group({
      password: ['',  [ Validators.required,Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$')]],
      confirmpassword: ['', Validators.required]
    }, { validators: matchPassword });
  }
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resetpassword() {
    this.submitted = true;

    if (this.resetpasswordform.invalid) {
      this.resetpasswordform.markAllAsTouched();
      this.loading = false;
      return;
    }

    const { password, confirmpassword } = this.resetpasswordform.value;
    const resetPasswordData = {
      email: this.email,
      token: this.token,
      password: password,
      confirmpassword: password
    };

    console.log("Sending data to API:", resetPasswordData);

    let resetpasswordApi = this.userType === 'customer'
      ? this.authservice.customerResetPassword(resetPasswordData)
      : this.authservice.dpartnerResetPassword(resetPasswordData);

    this.loading = true;

    resetpasswordApi.subscribe({
      next: (res) => {

        if (res?.status_code?.toString() === "1") {
          this.notification.showMessage(res.status_message, 'success');
          setTimeout(() => {
            this.router.navigate(['userType/reset-password-success']);
          }, 2000);
        } else {
          this.notification.showMessage(res?.status_message || "Error occurred", 'error');
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error("API Error:", err);
        this.notification.showMessage("Something went wrong", 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

// Function to Validate Matching Passwords
function matchPassword(group: AbstractControl): ValidationErrors | null {
  let password = group.get('password')?.value;
  let confirmPassword = group.get('confirmpassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
