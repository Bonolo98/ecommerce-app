import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviewsByProduct(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  addReview(reviewData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Ensure the token is retrieved

    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, reviewData, { headers });
  }
}
