import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  /** Get user's latitude and longitude */
  getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(" Latitude:", position.coords.latitude, "Longitude:", position.coords.longitude);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error(" Error getting location:", error);
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }

  /** Convert latitude & longitude to address using OpenStreetMap */
  getFullAddress(latitude: number, longitude: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;

    return this.http.get(url).pipe(
      map((response: any) => {
        if (!response || !response.address) {
          return { error: true, message: "Address not found" };
        }

        const addressData = response.address;
        console.log("Address Data:", addressData);

        return {
          error: false,
          message: "Address found",
          data: {
            flatno: addressData.house_number || "N/A",  // Use "N/A" if house number is missing
            street: addressData.road ||  addressData.county ||"N/A",
            landmark: addressData.neighbourhood || addressData.suburb || addressData.village || "N/A",
            city: addressData.city || addressData.town || addressData.state_district || "Unknown",
            state: addressData.state || "N/A",
            pincode: String(addressData.postcode || "000000"),
            latitude: String(latitude),
            longitude: String(longitude),
            fullAddress: response.display_name || ""
          }
        };
      })
    );
  }

  getCoordinates(address: string): Observable<any> {
    if (!address) return new Observable();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return this.http.get(url);
  }
  getLatLngFromAddress(address: string): Observable<{ lat: number; lng: number } | { error: boolean }> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return this.http.get<any[]>(url).pipe(
      map(response => {
        if (response.length > 0) {
          return { lat: parseFloat(response[0].lat), lng: parseFloat(response[0].lon) };
        }
        return { error: true };
      })
    );
  }

}
