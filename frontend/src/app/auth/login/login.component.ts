import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  login() {
    // Start loading
    this.isLoading = true;

    // Validate user input
    if (!this.username || !this.password) {
      this.errorMessage = 'Both fields are required.';
      this.isLoading = false; // Stop loading
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      this.isLoading = false; // Stop loading
      return;
    }

    // Proceed with the login attempt
    this.authService.login({ username: this.username, password: this.password })
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

          // Navigate based on user role
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }

          // Stop loading
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Invalid credentials';
          this.isLoading = false;  // Stop loading
        }
      );
  }
}
