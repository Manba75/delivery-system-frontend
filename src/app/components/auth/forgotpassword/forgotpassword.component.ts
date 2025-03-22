import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from "../../../utils/notification/notification.component";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  public userType: string = 'customer';
  public forgotpasswordform!: FormGroup;
  public submitted: boolean = false;
  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });

    this.forgotpasswordform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  forgotpassword() {
    this.submitted = true;
    if (this.forgotpasswordform.invalid) {
      return;
    }

    let userdata = this.forgotpasswordform.value;

    let forgotpasswordApi =
      this.userType === 'customer'
        ? this.authservice.customerforgotPassword(userdata)
        : this.authservice.dpartnerforgotPassword(userdata);

    this.loading = true;

    forgotpasswordApi.subscribe({
      next: (res) => {
        if (res && res.status_code == '1') {
          console.log("res",res);
          this.notification.showMessage(res.status_message, 'success');

          // setTimeout(() => {
          //   this.router.navigate(['userType/reset-password'], { queryParams: { token:res.data.resetToken , email: userdata.email} });
          // }, 2000);
        } else {
          this.notification.showMessage(res.status_message, 'error');
        }
      },
      // error: (err: any) => {
      //   this.notification.showMessage('Something went wrong', 'error');
      //   console.error(err);
      // },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
