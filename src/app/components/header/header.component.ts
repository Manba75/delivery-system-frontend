import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust import path
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuActive = false;
  isUserLoggedIn = false;
  user: string = "";
  username: string = "";
  extractedName: string = "";
  updatedName: string = "";
  isProfileDropdownOpen = false;
  userType: string | null = "";
  isAvailable: boolean = false;
  name: string = "";
  userId: number | null = null;

  constructor(private authservice: AuthService, private router: Router) {}

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.isUserLoggedIn = this.authservice.isLoggedIn();

    let user = localStorage.getItem('user');
    if (user) {
      this.isUserLoggedIn = true;
      const parsedUser = JSON.parse(user);
      this.name = this.userType === "customer" ? parsedUser.cust_name : parsedUser.dpartner_name;
      this.username = this.name || "Guest";
    }

    this.extractedName = this.getNameFromEmail(this.username);
    this.updatedName = this.getDisplayName();
    this.userId=user ? JSON.parse(user).id : null;
 
    const storedAvailability = localStorage.getItem("isavailable");
    this.isAvailable = storedAvailability ? storedAvailability === "true" : false;
     this.getAvailable();
  
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-info')) {
      this.isProfileDropdownOpen = false;
    }
  }

  logout() {
    this.authservice.logout();
    this.isUserLoggedIn = false;
    this.router.navigate(['/']);
  }

  getNameFromEmail(email: string): string {
    if (!email || !email.includes('@')) return "Guest";
    let namePart = email.split('@')[0]; 
    let formattedName = namePart.replace(/[\W_]+/g, ' '); 
    return formattedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  updateName(newName: string) {
    this.updatedName = newName.trim();
  }

  getDisplayName(): string {
    return this.updatedName || this.username || this.extractedName;
  }


  setAvailability(event: Event) {
    this.isAvailable = (event.target as HTMLInputElement).checked;
    console.log("Before API Call - isAvailable:", this.isAvailable);

    this.authservice.setDpartnerAvailability({ isavailable: this.isAvailable }).subscribe({
      next: (response) => {
        console.log("API Response:", response);

        if (response?.data?.data?.dpartner_isavailable !== undefined) {
          this.isAvailable = response.data.data.dpartner_isavailable;
          localStorage.setItem("isavailable", String(this.isAvailable));
        } else {
          console.error("Invalid response structure:", response);
        }
      },
      error: (error: any) => {
        console.error("API Error:", error);
      }
    });
  }

 
  getAvailable() {
    this.authservice.getDpartnerAvailable().subscribe({
      next: (response) => {
        console.log("API Response:", response);

        if (response && response.status_code === '1' ) {
          this.isAvailable = response.data.find((item: any) => item.id === this.userId)?.dpartner_isavailable ?? false;

          console.log("Filtered Availability:", this.isAvailable);
          this.isAvailable = response.data.dpartner_isavailable;
          localStorage.setItem("isavailable", String(this.isAvailable));
        } else {
          console.error("Invalid response structure:", response);
        }
      },
      error: (error) => console.error("API Error:", error)
    });
  }
}
