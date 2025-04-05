import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { NotificationComponent } from '../../../../utils/notification/notification.component';
import { CityService } from 'src/app/services/city.service';
import { VehicletypeService } from 'src/app/services/vehicletype.service';

@Component({
  selector: 'app-dpartnerprofile',
  templateUrl: './dpartnerprofile.component.html',
  styleUrls: ['./dpartnerprofile.component.css']
})
export class DpartnerprofileComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  public dpartnerprofileform!:FormGroup;
  public loading : boolean=false;
  public dpartnerdata : any={};
  public issubmitted :boolean=false;
  cities: any = [];
  vehicletypes :any=[];
  constructor(private authservice:AuthService,private fb:FormBuilder,private cityservice:CityService,private vehicletypeservice:VehicletypeService) { }

  ngOnInit(): void {
    this.dpartnerprofileform=this.fb.group({
      dpartner_email: [{ value: '', disabled: true }],
      dpartner_name: ['',[Validators.required]],
      dpartner_phone: ['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      dpartner_licence_number:['',[Validators.required, Validators.minLength(10),Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      vehicle_name:['',[Validators.required]],
      vehicle_number:['',[Validators.required, Validators.minLength(4),Validators.maxLength(6), Validators.pattern('^[A-Z0-9]+$')]],
      city_name:['',[Validators.required]],
      vehicletype_type:['',[Validators.required]],

    })
    this.getProfile();
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

  // get profile
  getProfile(){
    this.loading=true;
    this.authservice.getDpartnerDetails().subscribe({
      next:(response)=>{
        this.loading=true;
        if(response && response.status_code=='1'){
          console.log(response);
          this.notification.showMessage(response.status_message,'success');
          this.dpartnerdata=response.data;
          this.dpartnerprofileform.patchValue(this.dpartnerdata);
        }else{
          this.notification.showMessage(response.status_message,'error');
        }
      },
      error:(error)=>{
        this.notification.showMessage(error.status_message,'error');
      },
      complete:()=>{
        this.loading=false;
      }
    })

  }
  updateProifle(){
    this.issubmitted=true;
    // if(this.dpartnerprofileform.invalid){
    //   this.dpartnerprofileform.markAllAsTouched();
    //   console.log("invalid");
    //   return;
    // }
    this.loading=true;
    let userData={...this.dpartnerprofileform.value}
    this.authservice.updateDpartnerProfile(userData).subscribe({
      next:(response)=>{
        if(response && response.status_code=='1'){
          this.notification.showMessage(response.status_message,'success');
          this.getProfile();
        }else{
          this.notification.showMessage(response.status_message,'error');
        }
      },
      error:(error)=>{
        this.notification.showMessage(error.status_message,'error');
      },
      complete:()=>{
        this.loading=false;
      }
    })
  }
}
