// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment.prod';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = `${environment.apiUrl}/auth`;

//   constructor(private http: HttpClient, private router: Router) {}

//   login(credentials: { username: string; password: string }): Observable<any> {
//     return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials);
//   }

//   register(user: { username: string; password: string; email?: string; phone?: string }) {
//     return this.http.post(`${this.apiUrl}/register`, user);
//   }

//   logout() {
//     localStorage.removeItem('token');
//     this.router.navigate(['/login']);
//   }

//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('token');
//   }


//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   getUsername(): any {
//     const token = this.getToken(); // Retrieve token from localStorage
//     if (!token) return null;
  
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
//       console.log('Decoded JWT:', payload); // Debugging
//       return payload.username || null;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   }

//   getUserId(): any {
//     const token = this.getToken(); // Retrieve token from localStorage
//     if (!token) return null;
  
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
//       console.log('Decoded JWT:', payload); // Debugging
//       return payload.id || null;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   }

//   getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders().set('Authorization', `Bearer ${token}`);
//   }


//   getUserRole(): string {
//     const token = this.getToken();
//     if (!token) return '';
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.role;
//   }
  
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Function to get Authorization headers
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      credentials,
      { headers: this.getAuthHeaders() }  // Apply headers
    );
  }

  register(user: { username: string; password: string; email?: string; phone?: string }) {
    return this.http.post(`${this.apiUrl}/register`, user, {
      headers: this.getAuthHeaders(), // Apply headers
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      console.log('Decoded JWT:', payload); 
      return payload.username || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserId(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      console.log('Decoded JWT:', payload); 
      return payload.id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
}

