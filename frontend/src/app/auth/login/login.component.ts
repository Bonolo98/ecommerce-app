import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
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

  // login() {
  //   this.authService.login({ username: this.username, password: this.password }).subscribe(
  //     (response) => {
  //       localStorage.setItem('token', response.token);
  //       const role = this.authService.getUserRole();
  //       if (role === 'admin') {
  //         this.router.navigate(['/admin']);
  //       } else {
  //         this.router.navigate(['/']);
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = 'Invalid credentials';
  //     }
  //   );
  // }

  login() {
    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          const role = this.authService.getUserRole();

          // Sync local cart to database after login
          const userId = JSON.parse(atob(response.token.split('.')[1])).id;
          const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

          console.log(userId);
          console.log(cartItems);

          // If there are items in the local cart, sync them to the database
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
