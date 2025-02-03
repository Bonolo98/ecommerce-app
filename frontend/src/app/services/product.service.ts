import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';
  // private apiUrl2 = 'http://localhost:3000/api/search?query=<>';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(this.apiUrl);
  }

  searchProducts() {
    return this.http.get(this.apiUrl);
  }

  getProductById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any) {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: number, product: any) {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
