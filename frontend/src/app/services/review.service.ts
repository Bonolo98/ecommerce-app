// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReviewService {
//   private apiUrl = 'http://localhost:3000/api/reviews';

//   constructor(private http: HttpClient) {}

//   getReviewsByProduct(productId: number): Observable<any> {
//     return this.http.get(`${this.apiUrl}/${productId}`);
//   }

//   addReview(reviewData: any): Observable<any> {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       return new Observable(observer => {
//         observer.error({ status: 401, message: 'Unauthorized' });
//       });
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.post(`${this.apiUrl}`, reviewData, { headers });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByProduct(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  addReview(reviewData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, reviewData, { headers });
  }
}

