import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Both username and password are required.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }
    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          const role = this.authService.getUserRole();

          const userId = JSON.parse(atob(response.token.split('.')[1])).id;
          const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

          console.log(userId);
          console.log(cartItems);

          if (cartItems.length > 0) {
            this.cartService.syncLocalCartToDatabase(userId, cartItems);
          }

          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.errorMessage = 'Invalid credentials';
        }
      );
  }
}
