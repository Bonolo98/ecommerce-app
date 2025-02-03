import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  addReview(productId: number, rating: number, comment: string) {
    return this.http.post(`${this.apiUrl}`, { productId, rating, comment });
  }

  getReviews(productId: number) {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }
}
