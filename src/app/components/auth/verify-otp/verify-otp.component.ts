import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOTPComponent implements OnInit {

  userType: string = ''; // 'customer' or 'deliverypartner'
  // token: string = '';
  // otp: string = '';
  // apiUrl = 'https://yourapi.com'; // Your Backend API URL

  constructor() {}
  // private route: ActivatedRoute,
  // private router: Router
  ngOnInit() {
    // this.route.paramMap.subscribe((params) => {
    //   this.userType = params.get('userType') || 'customer';
    // });

    // this.route.queryParamMap.subscribe((queryParams) => {
    //   this.token = queryParams.get('token') || '';
    // });
  }

  // verifyOtp() {
  //   const data = {
  //     token: this.token,
  //     otp: this.otp
  //   };

  //   this.http.post(`${this.apiUrl}/${this.userType}/verify-otp`, data).subscribe({
  //     next: (res) => {
  //       alert('OTP Verified Successfully');
  //       this.router.navigate([`/dashboard/${this.userType}`]); // Redirect to respective dashboard
  //     },
  //     error: () => {
  //       alert('OTP Verification Failed');
  //     }
  //   });
  // }

}
