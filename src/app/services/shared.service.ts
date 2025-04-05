import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private orderDataSubject = new BehaviorSubject<any>({});
  orderData$ = this.orderDataSubject.asObservable(); // Observable for components to subscribe to

  constructor() {}

  // Set data and emit changes
  setOrderData(data: any): void {
    const updatedData = { ...this.orderDataSubject.value, ...data };
    this.orderDataSubject.next(updatedData);
  }

  // Get current data snapshot
  getOrderData(): any {
    return this.orderDataSubject.value;
  }

  // Clear data
  clearOrderData(): void {
    this.orderDataSubject.next({});
  }
}
