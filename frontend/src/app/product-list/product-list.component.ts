import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { NavbarComponent } from '../navbar/navbar.component';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink,
    CurrencyPipe,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    NavbarComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  addToCart(product: any): void {
    const token = this.authService.getToken();
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;
    this.cartService.addToCart(userId, product.id);
    alert(`${product.name} added to cart!`);
  }

  filterProducts(searchTerm: string): void {
    this.searchQuery = searchTerm;
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.filteredProducts = this.products.filter((product) =>
      product.name && product.name.includes(this.searchQuery)
    );
  }
  
}
