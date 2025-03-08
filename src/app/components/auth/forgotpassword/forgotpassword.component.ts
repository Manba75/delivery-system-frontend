import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  userType: string = 'customer';

  constructor(private route: ActivatedRoute ,private router:Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userType = params.get('userType') || 'customer';
    });
  }
  onsubmit(){
     this.router.navigate([`verify-otp/${this.userType}`]);
  }

}
