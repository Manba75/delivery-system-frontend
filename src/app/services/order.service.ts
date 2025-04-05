import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface AuthResponse {
  status_code: string;
  status_message: string;
  data?: any;

}

@Injectable({
  providedIn: 'root'
})
export class orderService {
  private baseurl = environment.apibaseURL;

  constructor(private http: HttpClient) { }

  placeorder(order: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}order/place-order`, order);
  }
  getorders(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseurl}order/get-orders` );
  }
  acceptOrder(orderdata:any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}order/accept-order`, orderdata);
  }
  orderStatusUpdate(orderdata:any):Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.baseurl}order/update-status`, orderdata);
  }
  getcustomerOrders(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseurl}order/get-customer-order` ,{withCredentials:true});

  }
  verifyorderotp(orderdata:any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseurl}order/verify-pickup-otp`, orderdata);
  }
  getOrderbyId(orderId: number): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseurl}order/get-order-by-id/${orderId}`);
  }

}
