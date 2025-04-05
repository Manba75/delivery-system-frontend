import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userType = localStorage.getItem('userType'); // Get user type (customer or dpartner)
    let token = userType ? localStorage.getItem(`${userType}_token`) : null; // Get respective token

    console.log(`🔍 Token Retrieved for ${userType}:`, token);

    if (!token) {
      console.warn(`No token found for current user: ${userType}`);
    }

    // Clone the request and attach the token if available
    const clonedReq = req.clone({
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    });

    console.log("Modified Request Headers:", clonedReq.headers.get('Authorization'));

    return next.handle(clonedReq).pipe(
      catchError((err) => {
        if (err.status === 401) {
          console.error("❌ Unauthorized! Token Expired/Invalid. Logging out...");
          localStorage.removeItem(`${userType}_token`);
          localStorage.removeItem('userType');
          this.cookieService.delete('token');
          window.location.href = ''; // Redirect to login
        }
        return throwError(() => err);
      })
    );
  }
}
