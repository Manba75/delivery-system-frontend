import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public  userTpe: string='';
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Allow access
    } else {
      this.userTpe = localStorage.getItem('userType') || ''; // Get user type from local storage
      this.router.navigate([`${this.userTpe}/login`]); // Redirect to login
      return false;
    }
  }
}
