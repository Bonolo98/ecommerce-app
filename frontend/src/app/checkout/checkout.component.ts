import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number | null = null;
  totalAmount: number = 0;

  fullName: string = '';
  phoneNumber: string = '';
  shippingAddress: string = '';

  currentTab: string = 'details';
  shippingCompleted: boolean = false;

  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setUserId();
    this.loadCart();
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

  switchTab(tab: string) {
    this.currentTab = tab;
  }

  nextTab() {
    if (!this.fullName || !this.phoneNumber || !this.shippingAddress) {
      alert('Please fill in all shipping details before proceeding.');
      return;
    }
    this.shippingCompleted = true;
    this.switchTab('payment');
  }

  placeOrder() {
    if (!this.userId) {
      alert('Please log in to proceed with checkout.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.paymentDetails.cardNumber || !this.paymentDetails.expiryDate || !this.paymentDetails.cvv) {
      alert('Please enter all payment details before placing the order.');
      return;
    }

    const orderData = {
      userId: this.userId,
      cartItems: this.cartItems,
      totalAmount: this.totalAmount,
      shippingAddress: this.shippingAddress,
      paymentDetails: this.paymentDetails
    };

    this.orderService.placeOrder(orderData).subscribe(
      () => {
        alert('Order placed successfully!');
        this.cartService.clearCart(this.userId)?.subscribe(() => {
          this.router.navigate(['/orders']);
        });
      },
      (error) => {
        console.error('Error placing order:', error);
      }
    );
  }
}

