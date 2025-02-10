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
import { SearchService } from '../services/search.service';

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
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loadProducts();

    // Listen for search updates
    this.searchService.searchQuery$.subscribe((query) => {
      this.filterProducts(query);
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.filteredProducts = data; // Show all initially
    });
  }

  filterProducts(query: string) {
    if (!query) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
}
