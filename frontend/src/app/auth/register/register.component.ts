import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
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

  constructor(private authService: AuthService, private router: Router) {}

  isFormValid(): boolean {
    return !!this.username && !!this.password && this.password.length >= 6;
  }

  register() {
    if (this.isFormValid()) {
      this.authService.register({ username: this.username, password: this.password, email: this.email, phone: this.phone })
        .subscribe(
          (response) => {
            if (response) {
              alert('Successfully Registered! You can now log in.');
              this.router.navigate(['/login']);
            }
          },
          (error) => {
            console.error('Registration error', error);
            this.message = 'Registration failed. Please try again.';
          }
        );
    } else {
      this.message = 'Please fill out all required fields correctly.';
    }
  }
}
