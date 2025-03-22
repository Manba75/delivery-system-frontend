import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { NotificationComponent } from '../../../../utils/notification/notification.component';

@Component({
  selector: 'app-customerprofile',
  templateUrl: './customerprofile.component.html',
  styleUrls: ['./customerprofile.component.css']
})
export class CustomerprofileComponent implements OnInit {
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
   profileForm!:FormGroup
   userdata:any ={}
  constructor(private fb:FormBuilder,private authservice:AuthService) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      cust_email: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      street: ['', Validators.required],
      landmark: ['', Validators.required],
      flatno: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
    this.getuserdetails();
  }

  getuserdetails(){
    this.authservice.getUserDetails().subscribe({
      next:(response)=>{
        if(response && response.status_code==='1'){

          this.userdata = response.data.user;
          console.log("userdata",this.userdata)
          const [firstName, ...lastName] = response.data.cust_name.split(' ');
          this.profileForm.patchValue(this.userdata);
          // this.profileForm.patchValue({
          //   cust_email:response.data.cust_email,
          //   fname:firstName || '',
          //   lname:lastName.join(' ') || '',
          //   phone:response.data.cust_phone,
          //   street:response.data.address_street,
          //   landmark:response.data.address_landmark,
          //   flatno:response.data.address_flatno,
          //   city:response.data.city,
          //   zip:response.data.address_pincode
          // })
        }


      }

    });
  }
  updateprofile(){

  }

}
