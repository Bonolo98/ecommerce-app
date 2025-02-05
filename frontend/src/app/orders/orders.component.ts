import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../services/order.service';

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  userId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private orderService: OrderService) {}

  ngOnInit() {
    this.setUserId();
    this.loadOrders();
  }

  setUserId() {
    const token = this.authService.getToken();
    if (token) {
      this.userId = JSON.parse(atob(token.split('.')[1])).id;
    }
  }

  loadOrders() {
    if (this.userId) {
      this.orderService.getOrders(this.userId);
    }
  }
}
