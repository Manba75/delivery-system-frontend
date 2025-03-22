import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieservice: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
  
    if (token) {
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
  
      return next.handle(clonedReq).pipe(
        catchError((err) => {
          if (err.status === 401) { // Token expired or invalid
            console.error("Token expired or invalid. Redirecting to login.");
            localStorage.removeItem('token'); // Clear token
            window.location.href = '/login'; // Redirect to login page
          }
          return throwError(() => err);
        })
      );
    }
  
    return next.handle(req);
  }
 
}
