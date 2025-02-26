import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Order } from '../orders/orders.component';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, orderData);
  }


  getOrdersByUser(userId: number): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      map((response) => {
        console.log('Raw API Response:', response);
  
        if (response && response.success && Array.isArray(response.orders)) {
          return response.orders;
        } else {
          return [];
        }
      }),
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }
  
}
