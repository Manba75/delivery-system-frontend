import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationComponent } from '../../../utils/notification/notification.component';
import { Router } from '@angular/router';
import { CityService } from '../../../services/city.service';
import { VehicletypeService } from '../../../services/vehicletype.service';

@Component({
  selector: 'app-deliverypartnersignup',
  templateUrl: './deliverypartnersignup.component.html',
  styleUrls: ['./deliverypartnersignup.component.css']
})
export class DeliverypartnersignupComponent implements OnInit {
 @ViewChild(NotificationComponent) notification!: NotificationComponent;
  public dpartnersignupform!: FormGroup;
  public isSubmitted: boolean = false;
  public loading: boolean = false;
  cities: any = [];
  vehicletypes :any=[];

  constructor(private fb: FormBuilder, private authservice:AuthService,private router:Router, private cityservice: CityService,private vehicletypeservice:VehicletypeService,private cookieservice:CookieService) { }

  ngOnInit(): void {
    this.dpartnersignupform = this.fb.group({
      dpartner_email: ['', [Validators.required, Validators.email]],
      dpartner_pass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$')]],
      city: ['',[Validators.required]],
      dpartner_licence: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      vehicle_name: ['',[Validators.required]],
      vehicletype: ['',[Validators.required]],
      vehicle_number: ['',[Validators.required]],
      dpartner_phone: ['',[Validators.required,Validators.pattern('^[0-9]{10}$')]]


    });
    this.cityservice.getCities().subscribe({
      next: (response) => {
        if (response && response.status_code === "1") {
          this.cities = response.data;
          console.log("Cities:", this.cities);
        }
      },
      error: (error) => {
        console.error("City Fetch Error:", error);
      }
    });
    this.vehicletypeservice.getvehicletypes().subscribe({
      next: (response) => {
        if (response && response.status_code === "1") {
          this.vehicletypes = response.data;
          // console.log("v",response)
          console.log("Vehicletypes:", this.vehicletypes);
        }
      },
      error: (error) => {
        console.error("Vehicletype Fetch Error:", error);
      }
    });
  }

  dpartnersignup() {


    this.isSubmitted = true;
    if(this.dpartnersignupform.invalid) {
      this.dpartnersignupform.markAllAsTouched()
      console.log("invalid")
      return;
    }
    console.log("mmm");
    this.loading = true;
    let userData = this.dpartnersignupform.value;
    console.log("u",userData);
    console.log("hh");
    this.authservice.dpartnerSignup(userData).subscribe({
      next: (response) => {
        console.log(response);
        // let email=response.data.user.user.dpartner_email;

        // console.log("email",email);
        if(response && response.status_code === "1") {
          this.notification.showMessage(response.status_message,"success");
          this.router.navigate(['/dpartner/verify-otp'], {queryParams: {email:userData.dpartner_email}});

        }else{
          this.notification.showMessage(response.status_message,"error");

        }

      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
