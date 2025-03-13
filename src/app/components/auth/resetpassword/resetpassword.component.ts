import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  userType: string = 'customer';
  // token: string = '';
  // newPassword: string = '';
  // confirmPassword: string = '';
  // apiUrl = 'https://yourapi.com';

  constructor(private route: ActivatedRoute,  private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || '';
    });

    // this.route.queryParamMap.subscribe((queryParams) => {
    //   this.token = queryParams.get('token') || '';
    // });
  }

  // resetPassword() {
  //   if (this.newPassword !== this.confirmPassword) {
  //     alert("Passwords don't match");
  //     return;
  //   }

    // const data = {
    //   token: this.token,
    //   newPassword: this.newPassword,
    // };

    // this.http.post(`${this.apiUrl}/${this.userType}/resetpassword`, data).subscribe({
    //   next: (res) => {
    //     alert('Password Reset Successful');
    //     this.router.navigate([`/login/${this.userType}`]); // Redirect to respective login page
    //   },
    //   error: () => {
    //     alert('Reset Password Failed');
    //   }
    // });
  // }
}
