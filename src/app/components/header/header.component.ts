import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import your authentication service
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuActive = false;
  isUserLoggedIn = false;
  username: string = "";
  extractedName: string = "";
  updatedName: string = "";
  isProfileDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    const user = localStorage.getItem('user');
    if (user) {
      this.isUserLoggedIn = true;
      this.username = JSON.parse(user).name || ""; // Extract user name
    }

    this.extractedName = this.getNameFromEmail(this.username);
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
    this.authService.logout();
    this.isUserLoggedIn = false;
    this.router.navigate(['/']);
  }

  getNameFromEmail(email: string): string {
    if (!email || !email.includes('@')) return "Guest";

    let namePart = email.split('@')[0]; // Get part before '@'
    let formattedName = namePart.replace(/[\W_]+/g, ' '); // Replace dots/underscores with spaces

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
    // ✅ Updated: Checks updated name first, then full username, then extracted name
  }
}
