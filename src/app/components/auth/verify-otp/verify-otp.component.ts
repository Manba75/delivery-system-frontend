import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from '../../../utils/notification/notification.component';
import { query } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOTPComponent implements OnInit {

  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  public userType: string = 'customer';
  public email: string = '';
  public verifyOTPForm!: FormGroup;
  public submitted: boolean = false;
  public loading: boolean = false;

  constructor(private route: ActivatedRoute,private authservice: AuthService,private router: Router,private fb:FormBuilder,private cookieservice:CookieService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    console.log("email",this.email)

    this.verifyOTPForm = this.fb.group({
      otp: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern('^[0-9]*$')]]
    });
  }

  verifyOTP() {
   this.submitted = true;
    if (this.verifyOTPForm.invalid) {
      this.loading = false;
      this.verifyOTPForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    let data=this.verifyOTPForm.value;

    let userdata={
      email:this.email,
      otp:data.otp
    }


    let verifyOTPApi=this.userType=='customer'?this.authservice.customerverifyOtp(userdata):this.authservice.dpartnerverifyOtp(userdata);

    verifyOTPApi.subscribe({

      next:(response)=>{

        if( response && response.status_code==='1'){

          localStorage.setItem("token", response.data.token);
          this.cookieservice.set("token", response.data.token, { path: "/", secure: true, sameSite: "Lax" });
          this.notification.showMessage(response.status_message,"success")


          setTimeout(() => {
            this.router.navigate([`${this.userType}/login`]);
            // this.loading = false;
          }, 1000);

        }else{
          this.notification.showMessage(response.status_message, "error" )
        }
      },
      error:(error)=>{

        this.notification.showMessage("somthing went wrong","error");
      },
      complete:()=>{
        this.loading=false;
      }
    })


  }

}
