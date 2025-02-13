import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  // BehaviorSubject to store cart state
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable(); // Expose cart observable

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: number | null, product: any): Observable<any> {
    const productId = product.id;
  
    if (userId) {
      return this.http.post(`${this.apiUrl}/add`, { userId, productId }); // Only send productId
    } else {
      let cart = this.getCartFromLocalStorage();
      const existingItem = cart.find((item: any) => item.id === productId);
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }
  
      this.saveCartToLocalStorage(cart);
      this.cartSubject.next(cart);
      return new Observable((observer) => {
        observer.next();
        observer.complete();
      });
    }
  }
  

  refreshCart(userId: number) {
    this.getCart(userId).subscribe((data) => {
      this.cartSubject.next(data.cart);
    });
  }

  saveCartToLocalStorage(cartItems: any[]) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  getCartFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

    clearCart(userId: number | null): Observable<any> | void {
    if (userId) {
      return this.http.post(`${this.apiUrl}/clear`, { userId });
    } else {
      this.clearLocalStorageCart();
    }
  }

    clearLocalStorageCart() {
    localStorage.removeItem('cart');
  }

  //   removeFromCart(userId: number, productId: number): Observable<any> | void {
  //   if (userId) {
  //     return this.http.delete<any>(`${this.apiUrl}/`, { userId, productId });
  //   } else {
  //     let cart = this.getCartFromLocalStorage();
  //     cart = cart.filter((item: any) => item.id !== productId);
  //     this.saveCartToLocalStorage(cart);
  //   }
  // }

  removeFromCart(userId: number | null, productId: number): Observable<any> | void {
    if (userId) {
      return this.http.delete(`${this.apiUrl}/${userId}`, {
        body: { productId }, // Pass productId inside "body"
      });
    } else {
      let cart = this.getCartFromLocalStorage();
      cart = cart.filter((item: any) => item.id !== productId);
      this.saveCartToLocalStorage(cart);
      return; // Explicitly return void
    }
  }
  

  syncLocalCartToDatabase(userId: string, cartItems: any[]) {
  this.http.post(`${this.apiUrl}/add`, { userId, items: cartItems }).subscribe(
    (response) => {
      console.log('Cart synced successfully');
      // Optionally, clear the local storage after sync
      localStorage.removeItem('cart');
    },
    (error) => {
      console.error('Error syncing cart', error);
    }
  );
}


}

