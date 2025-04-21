import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Import Cookie Service
import { NotificationComponent } from '../../../utils/notification/notification.component';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  public customersignup!: FormGroup;
  public submitted: boolean = false;
  public loading: boolean = false;
  public userType:string = 'customer';
  cities :any =[];

 constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService // Inject Cookie Service
  ) {}

  ngOnInit(): void {
    this.customersignup = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email, Validators.minLength(10), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,4}$'), this.lowercaseValidator]],
        password: ['',[ Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$')]],
        confirmpassword: ['', Validators.required]
      },
      { validators: matchPassword }
    );


  }
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleconfirmPasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private lowercaseValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    return /[a-z]/.test(value) ? null : { lowercase: true };
  }

  signupForm() {
    this.submitted = true;

    if (this.customersignup.invalid) {
      this.customersignup.markAsUntouched();
      return;
    }

    this.loading = true;
    let userData = this.customersignup.value;

    this.authService.customerSignup(userData).subscribe({

      next: (response) => {
        if (response && response.status_code === "1") {

          this.notification.showMessage(response.status_message || "Signup successful!", "success");
          this.customersignup.reset();
          Object.keys(this.customersignup.controls).forEach((key) => {
            this.customersignup.controls[key].setErrors(null);
          });
          this.router.navigate(['customer/verify-otp'],{ queryParams: {  email:userData.email } });
        } else {
          let errorMessage = response.status_message || "Signup failed! Please try again.";
          this.notification.showMessage(errorMessage, "error");
          this.customersignup.patchValue({ password: '', confirmpassword: '' });
        }
      },
      error: (error) => {
        console.error("Signup Failed:", error);
        let errorMessage = error.error?.status_message || "Signup failed! Please try again.";
        this.notification.showMessage(errorMessage, "error");
        this.customersignup.patchValue({ password: '', confirmpassword: '' });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

 function matchPassword(group: AbstractControl): ValidationErrors | null {
  let password = group.get('password')?.value;
  let confirmPassword = group.get('confirmpassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
