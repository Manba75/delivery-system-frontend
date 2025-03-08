import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // loginForm: FormGroup;
  userType: string = 'customer'; // Default login type

  constructor(
    private route: ActivatedRoute,
    // private fb: FormBuilder,
    // private customerAuth: CustomerAuthService,
    // private deliveryAuth: DeliveryPartnerAuthService,
    private router: Router
  ) {
  //   this.loginForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //   });
  // }
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });
  }
  switchLoginType() {
    const newUserType = this.userType === 'customer' ? 'delivery-partner' : 'customer';
    this.router.navigate(['/login', newUserType]); // Navigate to new login type
  }

  // login() {
  //   if (this.loginForm.invalid) return;

  //   if (this.userType === 'customer') {
  //     this.customerAuth.login(this.loginForm.value).subscribe(
  //       (res: any) => {
  //         localStorage.setItem('token', res.token);
  //         localStorage.setItem('role', 'customer');
  //         this.router.navigate(['/customer/dashboard']);
  //       },
  //       () => alert('Invalid Customer Credentials')
  //     );
  //   } else {
  //     this.deliveryAuth.login(this.loginForm.value).subscribe(
  //       (res: any) => {
  //         localStorage.setItem('token', res.token);
  //         localStorage.setItem('role', 'delivery-partner');
  //         this.router.navigate(['/delivery-partner/dashboard']);
  //       },
  //       () => alert('Invalid Delivery Partner Credentials')
  //     );
  //   }
  // }


}

