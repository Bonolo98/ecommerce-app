// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment.prod';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   private apiUrl = `${environment.apiUrl}/products`;

//   constructor(private http: HttpClient) {}

//   getProducts() {
//     return this.http.get(this.apiUrl);
//   }

//   searchProducts() {
//     return this.http.get(this.apiUrl);
//   }

//   getProductById(id: number) {
//     return this.http.get(`${this.apiUrl}/${id}`);
//   }

//   createProduct(product: any) {
//     return this.http.post(this.apiUrl, product);
//   }

//   updateProduct(id: number, product: any) {
//     return this.http.put(`${this.apiUrl}/${id}`, product);
//   }

//   deleteProduct(id: number) {
//     return this.http.delete(`${this.apiUrl}/${id}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' // Attach token if available
    });
  }

  getProducts() {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  searchProducts() {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getProductById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProduct(product: any) {
    return this.http.post(this.apiUrl, product, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: any) {
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

