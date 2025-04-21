import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationComponent } from '../../utils/notification/notification.component';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  public verifyemailform!: FormGroup;
  public submitted: boolean = false;
  public loading: boolean = false;
  public userType: string = 'customer'; // Default to 'customer'

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userType = params.get('userType') || 'customer';

    });
    this.verifyemailform = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  verifyemail() {
    this.submitted = true;
    if (this.verifyemailform.invalid) {
      this.verifyemailform.markAllAsTouched();
      return;
    }

    this.loading = true;
    const userData = this.verifyemailform.value;

    console.log("Verifying email for:", this.userType);

    const verifyApi =
      this.userType === 'customer'
        ? this.authservice.verifyEmail(userData)
        : this.authservice.verifyDpartnerEmail(userData);
        verifyApi.subscribe({
          next: (response) => {

            if (response?.status_code === "1") {
              let user = response?.data;

              
              if (user?.cust_isverify === false) {
               

                this.authservice.customerResendOtp({ email: userData.email }).subscribe({
                  next: (res) => {
                    this.notification.showMessage(res.status_message, "success");
                    this.router.navigate(['customer/verify-otp'],{queryParams:{ email: userData.email }}); // ✅ Redirect to OTP page
                  },
                  error: () => {
                    this.notification.showMessage("Failed to resend OTP. Try again.", "error");
                  }
                });
                return;
              }
              if (user?.dpartner_isverify === false) {

                this.authservice.dpartnerResendOtp({ email: userData.email }).subscribe({
                  next: () => {
                    this.notification.showMessage("Resent OTP im your email check and verify", "success");
                    setTimeout(()=>{
                      this.router.navigate(['dpartner/verify-otp'],{queryParams:{ email: userData.email }});
                    },1000)
                  },
                  error: () => {
                    this.notification.showMessage("Failed to resend OTP. Try again.", "error");
                  }
                });
                return;
              }


              this.notification.showMessage(response.status_message || "Email is already registered. Please login!", "success");
              setTimeout(() => {
                this.router.navigate([this.userType === 'customer' ? '/customer/login' : '/dpartner/login'], { queryParams: { email: userData.email } });
              }, 1000);
              return;
            }
            this.notification.showMessage(response.status_message || "User not found. Please sign up!", "error");
            setTimeout(() => {
              this.router.navigate([this.userType === 'customer' ? '/customer/signup' : '/dpartner/signup']);
            }, 1000);
          },
          error: (error) => {
            console.error("Full API Error:", error);
            this.handleApiError(error);
          },
          complete: () => {
            this.loading = false;
          }
        });

  }



  handleApiError(error: any) {
    let errorMessage = "Something went wrong";
    this.notification.showMessage(errorMessage, "error");
  }
}
