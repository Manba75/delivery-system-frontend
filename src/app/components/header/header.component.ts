import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {
  }
  userType: string = 'customer';
  menuActive: boolean = false;

  toggleMenu() {
    this.menuActive = !this.menuActive;
    console.log("Menu Active:", this.menuActive);
  }


}
