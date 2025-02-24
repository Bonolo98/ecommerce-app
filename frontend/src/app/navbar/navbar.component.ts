import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchQuery: string = '';
  menuOpen: boolean = false;
  username: string = '';
  isLoggedIn: boolean = false;

  authService = inject(AuthService);
  searchService = inject(SearchService);

  @Output() searchQueryChange = new EventEmitter<string>();

  ngOnInit() {
    this.updateUserInfo();
    
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.updateUserInfo();
    });
  }

  updateUserInfo() {
    this.username = this.authService.getUsername() || '';
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onSearchChange() {
    this.searchService.updateSearch(this.searchQuery);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
