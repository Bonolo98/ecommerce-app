import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../orders/orders.component';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

    placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, orderData);
  }

  // getOrdersByUser(userId: number): Observable<Order[]> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`, { headers });
  // }

  getOrdersByUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return new Observable(observer => {
      this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers }).subscribe(
        response => {
          console.log("Raw API Response:", response); // 🔍 Debug API response
          observer.next(response);
          observer.complete();
        },
        error => {
          console.error("API Error:", error);
          observer.error(error);
        }
      );
    });
  }
  
}

