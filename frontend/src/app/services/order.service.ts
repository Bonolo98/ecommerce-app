import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders'; // Adjust based on your backend

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, orderData);
  }

  getOrders(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}
