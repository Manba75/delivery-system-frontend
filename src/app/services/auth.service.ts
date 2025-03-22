import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { query } from '@angular/animations';


export interface AuthResponse {
  status_code: string;
  status_message: string;
  data?: any;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseurl = environment.apibaseURL;

  constructor(private http: HttpClient) { }

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
    return this.http.post<AuthResponse>(`${this.baseurl}customer/login`, userdata);
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

      return this.http.get<AuthResponse>(`${this.baseurl}customer/get-profile`);

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
    return this.http.post<AuthResponse>(`${this.baseurl}dpartner/login`, userdata);
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




  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');

  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}
