import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  product_id: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})

export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number | null = null;
  totalAmount: number = 0;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.setUserId();
    this.cartService.cart$.subscribe((cart) => {
      this.cartItems = cart;
      console.log('CART: ',this.cartItems)
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('LOCAL STORAGE:', cartItems);
      this.calculateTotal();
    });
  
    if (this.userId) {
      this.cartService.refreshCart(this.userId); // Load cart from database
    } else {
      this.cartItems = this.cartService.getCartFromLocalStorage();
      this.calculateTotal();
    }
  }

  setUserId() {
    const token = this.authService.getToken();
    if (token) {
      this.userId = JSON.parse(atob(token.split('.')[1])).id;
    }
  }

  loadCart() {
    if (this.userId) {
      this.cartService.getCart(this.userId).subscribe(
        (data) => {
          this.cartItems = data.cart;
          this.calculateTotal();
        },
        (error) => {
          console.error('Error fetching cart:', error);
        }
      );
    } else {
      this.cartItems = this.cartService.getCartFromLocalStorage();
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(productId: number) {
    if (this.userId) {
      this.cartService.removeFromCart(this.userId, productId)?.subscribe(() => {
        this.loadCart();
      });
    } 
    else {
      this.cartService.removeFromCart(null, productId);
      this.loadCart();
    }
  }

  clearCart() {
    if (this.userId) {
      this.cartService.clearCart(this.userId)?.subscribe(() => {
        this.cartItems = [];
        this.totalAmount = 0;
      });
    } else {
      this.cartService.clearCart(null);
      this.cartItems = [];
      this.totalAmount = 0;
    }
  }

  goToCheckout() {
    if (!this.userId) {
      alert('Please log in to proceed with checkout.');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}

