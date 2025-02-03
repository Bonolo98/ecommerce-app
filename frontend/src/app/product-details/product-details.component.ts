import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-product-details',
    imports: [CommonModule, RouterLink],
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css'],
    standalone: true,
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};

  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(Number(id)).subscribe(data => {
        this.product = data;
      });
    }
  }

  // addToCart(product: any): void {
  //   const userId = 1; // Replace with the actual logged-in user ID
  
  //   this.cartService.addToCart(userId, product.id).subscribe(
  //     (response) => {
  //       alert(`${product.name} added to cart!`);
  //     },
  //     (error) => {
  //       console.error('Error adding to cart:', error);
  //       alert('Failed to add product to cart.');
  //     }
  //   );
  // }

  addToCart(product: any): void {
    const token = this.authService.getToken();
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    this.cartService.addToCart(userId, product.id);
    alert(`${product.name} added to cart!`);
  }
  
}
