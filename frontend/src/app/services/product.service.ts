import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://ecommerce-app-zp2y.onrender.com/api/products'; // ✅ Use the deployed backend

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Fetch a single product by ID
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new product (admin)
  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, product);
  }

  // Update a product (admin)
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  // Delete a product (admin)
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
