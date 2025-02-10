import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: true,
})
export class AppComponent {
  title = 'frontend';

  constructor(public authService: AuthService) {}
}
