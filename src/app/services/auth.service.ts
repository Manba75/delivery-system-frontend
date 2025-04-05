import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { query } from '@angular/animations';


export interface AuthResponse {
  token(arg0: string, token: any, arg2: { path: string; expires: number; }): unknown;
  status_code: string;
  status_message: string;
  data?: any;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseurl = environment.apibaseURL;


  constructor(private http: HttpClient,private cookieservice : CookieService) { }

   //customer verify email
   verifyEmail(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}customer/check-email`, userdata);
  }
  //customer signup
  customerSignup(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}customer/signup`, userdata);
  }

  //customer verify otp
  customerverifyOtp(userdata: any): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(`${this.baseurl}customer/verify-otp`, userdata);
  }

  //customer  resent otp
  customerResendOtp(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}customer/resend-otp`, userdata
    );
  }
  //customer login
  customerLogin(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}customer/login`, userdata,{ withCredentials: true })
  }

  //customer  forgotpassword
  customerforgotPassword(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}customer/forgot-password`, userdata);
  }

  // customer resetpassword
  customerResetPassword(userdata: any): Observable<AuthResponse> {
    console.log("url",`${this.baseurl}customer/reset-password`)

    return this.http.post<AuthResponse>(`${this.baseurl}customer/reset-password`, userdata);
  }

  getUserDetails(): Observable<AuthResponse> {

      return this.http.get<AuthResponse>(`${this.baseurl}customer/get-profile`,{withCredentials:true});

  }
  updateUserprofile(userdata:any):Observable<AuthResponse>{
    return this.http.put<AuthResponse>(`${this.baseurl}customer/update-profile`,userdata,{withCredentials:true});
  }

  //customer  get by id
  getCustomerById(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseurl}customer/customer-get-by-id`,{withCredentials:true});
  }


  /********************************************* */
  //delivery partner signup
  dpartnerSignup(userdata:any):Observable<AuthResponse>{
    console.log("userdata",userdata)
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/signup`,userdata);
  }

  //customer verify otp
  dpartnerverifyOtp(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/verify-otp`, userdata);
  }
  //delivery partner verify email
  verifyDpartnerEmail(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/check-email`, userdata);
  }

  // verify dpartner resent otp
  dpartnerResendOtp(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/resend-otp`, userdata
    );
  }
  //delivery partner login
  dpartnerLogin(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/login`, userdata,{withCredentials:true});
  }

  //dpartner forgotpassword
  dpartnerforgotPassword(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/forgot-password`, userdata);
  }

  //  // customer resetpassword
//dpartner resetpassword
  dpartnerResetPassword(userdata: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/reset-password`, userdata);
  }


  // dpartner get profile
  getDpartnerDetails(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseurl}dpartner/get-profile`,{withCredentials:true});
  }

  //dpartner update profile
  updateDpartnerProfile(userdata:any):Observable<AuthResponse>{
    return this.http.put<AuthResponse>(`${this.baseurl}dpartner/update-profile`,userdata,{withCredentials:true});
  }

  // dpartner update status
  setDpartnerAvailability(userdata:any):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/isavailable`,userdata,{withCredentials:true});
  }


  //dpartner get  avaible
  getDpartnerAvailable():Observable<AuthResponse>{
    return this.http.get<AuthResponse>(`${this.baseurl}dpartner/get-available-dpartner`,{withCredentials:true});
  }



  //isloggedin

  isLoggedIn(): boolean {
    const userType = localStorage.getItem('userType');
    const tokenKey = userType ? `${userType}_token` : null;
    const token = tokenKey ? localStorage.getItem(tokenKey) || this.cookieservice.get(tokenKey) : null;

    if (!token) {
      return false;
    }

    try {
      // Decode the token and check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Invalid token format:", error);
      this.logout();
      return false;
    }
  }

  logout() {
    const userType = localStorage.getItem('userType');
    if (userType) {
      localStorage.removeItem(`${userType}_token`);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    this.cookieservice.delete(`${userType}_token`);
    window.location.href = '';
  }

}
