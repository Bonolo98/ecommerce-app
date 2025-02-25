import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'user';
  email = '';
  phone = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      !!this.username &&
      this.username.length >= 3 &&
      !!this.password &&
      this.password.length >= 6 &&
      !!this.role &&
      !!this.email &&
      emailRegex.test(this.email)
    );
  }

  register() {
    this.isLoading = true;

    if (this.isFormValid()) {
      this.authService.register({
        username: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone,
        role: this.role
      })
      .subscribe(
        (response) => {
          if (response) {
            alert('Successfully Registered! You can now log in.');
            this.router.navigate(['/login']);
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Registration error', error);
          this.message = 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      this.message = 'Please fill out all required fields correctly.';
      this.isLoading = false;
    }
  }
}
