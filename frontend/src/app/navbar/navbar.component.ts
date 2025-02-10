import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchQuery: string = '';
  menuOpen: boolean = false;
  username!: string;

  authService = inject(AuthService);
  searchService = inject(SearchService);

  @Output() searchQueryChange = new EventEmitter<string>();

  isLoggedIn = false;

  ngOnInit() {
    this.loadUsername(); // Load username on init
  }

  loadUsername() {
    this.username = this.authService.getUsername();
    console.log('Navbar Username:', this.username); // Debugging
  }

  onSearchChange() {
    this.searchService.updateSearch(this.searchQuery);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToProfile() {
    console.log('Navigating to profile...');
  }

  logout() {
    this.authService.logout();
  }
}
