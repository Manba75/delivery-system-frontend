import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private orderDataSubject = new BehaviorSubject<any>({});
  orderData$ = this.orderDataSubject.asObservable(); 

  constructor() {}

  setOrderData(data: any): void {
    const updatedData = { ...this.orderDataSubject.value, ...data };
    this.orderDataSubject.next(updatedData);
  }

  getOrderData(): any {
    return this.orderDataSubject.value;
  }

  clearOrderData(): void {
    this.orderDataSubject.next({});
  }
}
