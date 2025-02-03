import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    imports: [RouterLink],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  reviews: any[] = [];
  newProduct: any = {
    name: '',
    price: 0,
    stock: 0,
    category_id: 0
  };
  selectedProduct: any = null;

  constructor(private productService: ProductService, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.getProducts();
    // this.getReviews();
  }

  // Fetch products for admin view
  getProducts(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  // Fetch reviews for admin to view
  // getReviews(): void {
  //   this.reviewService.getReviews().subscribe((data: any) => {
  //     this.reviews = data;
  //   });
  // }

  // Add a new product
  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
      this.getProducts(); // Reload products list
      this.newProduct = { name: '', price: 0, stock: 0, category_id: 0 }; // Reset form
    });
  }

  // Delete a product
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.getProducts(); // Reload products list
    });
  }

  // Update product details
  updateProduct(id: number): void {
    this.productService.updateProduct(id, this.selectedProduct).subscribe(() => {
      this.getProducts(); // Reload products list
      this.selectedProduct = null; // Clear selected product
    });
  }

  // Set the selected product for editing
  selectProduct(product: any): void {
    this.selectedProduct = { ...product }; // Create a copy of the product for editing
  }
}
