import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

export interface OrderItem {
  image_url: string;
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: number;
  total_amount: number;
  shipping_address: string;
  status: string;
  cart_items: OrderItem[];
  products: any[]
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  userId: number | null = null;
  expandedOrderId: number | null = null;
  data: any;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.setUserId();
    this.fetchOrders();
    console.log(this.fetchOrders());
  }

  setUserId() {
    const token = this.authService.getToken();
    if (token) {
      this.userId = JSON.parse(atob(token.split('.')[1])).id;
    }
  }


  fetchOrders() {
    console.log('User ID before fetching orders:', this.userId);
    if (this.userId) {
      this.orderService.getOrdersByUser(this.userId).subscribe(
        (data: any) => {
          console.log('Orders fetched from API:', data);
          if (data && Array.isArray(data)) {
            this.orders = data;
          } else {
            this.orders = [];
          }
        },
        (error) => {
          console.error('Error fetching orders:', error);
          this.orders = [];
        }
      );
    }
  }
  


  toggleOrderDetails(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  }
}
