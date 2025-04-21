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
      return true; 
    } else {
      this.userTpe = localStorage.getItem('userType') || ''; 
      this.router.navigate([`${this.userTpe}/login`]); 
      return false;
    }
  }
}
