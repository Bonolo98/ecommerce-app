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
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserId();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(Number(id)).subscribe((data) => {
        this.product = data;
      });
    }
  }

  getUserId() {
    this.userId = this.authService.getUserId();
    // console.log('User ID:', this.userId);
  }

  // addToCart(product: any): void {
  //   const token = this.authService.getToken();
  //   const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  //   console.log(product.id)

  //   this.cartService.addToCart(userId, product.id);
  //   alert(`${product.name} added to cart!`);
  // }

  addToCart(productId: number) {
    // const userId = this.getUserId();
    // console.log('User ID:', userId);

    if (this.userId) {
      console.log(this.userId);
      this.cartService.addToCart(this.userId, productId).subscribe(() => {
        console.log('Product added to cart successfully');
      });
    } else {
      this.cartService.addToCart(null, productId).subscribe(() => {
        console.log('Product added to local cart');
      });
    }
  }
}
