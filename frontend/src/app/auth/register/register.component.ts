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
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register({ username: this.username, password: this.password, role: this.role, email: this.email, phone: this.phone })
      .subscribe(
        () => this.router.navigate(['/login']),
        (error) => (this.errorMessage = 'Registration failed')
      );
  }
}
