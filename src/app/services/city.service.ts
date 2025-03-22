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
export class CityService {
  private baseurl = environment.apibaseURL;

  constructor(private http: HttpClient) { }

  getCities(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseurl}city/cities`);
  }


}
