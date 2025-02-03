// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private cartKey = 'cartItems';

//   constructor() {}

//   // Get cart items from localStorage
//   getCart(): any[] {
//     return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
//   }

//   // Add product to cart and save in localStorage
//   addToCart(product: any): void {
//     let cart = this.getCart();
//     let existingProduct = cart.find((item) => item.id === product.id);

//     if (existingProduct) {
//       existingProduct.quantity += 1;
//     } else {
//       cart.push({ ...product, quantity: 1 });
//     }

//     localStorage.setItem(this.cartKey, JSON.stringify(cart));
//   }

//   // Get total cart items count
//   getCartCount(): number {
//     return this.getCart().reduce((count, item) => count + item.quantity, 0);
//   }

//   // Clear the cart
//   clearCart(): void {
//     localStorage.removeItem(this.cartKey);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: number | null, productId: number): Observable<any> | void {
    if (userId) {
      // User is logged in, add to database
      return this.http.post(`${this.apiUrl}/add`, { userId, productId });
    } else {
      // User is not logged in, store in localStorage
      let cart = this.getCartFromLocalStorage();
      const existingItem = cart.find((item: any) => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }

      this.saveCartToLocalStorage(cart);
    }
  }

  removeFromCart(userId: number | null, productId: number): Observable<any> | void {
    if (userId) {
      return this.http.post(`${this.apiUrl}/remove`, { userId, productId });
    } else {
      let cart = this.getCartFromLocalStorage();
      cart = cart.filter((item: any) => item.id !== productId);
      this.saveCartToLocalStorage(cart);
    }
  }

  clearCart(userId: number | null): Observable<any> | void {
    if (userId) {
      return this.http.post(`${this.apiUrl}/clear`, { userId });
    } else {
      this.clearLocalStorageCart();
    }
  }

  saveCartToLocalStorage(cartItems: any[]) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  getCartFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  clearLocalStorageCart() {
    localStorage.removeItem('cart');
  }

  // syncLocalCartToDatabase(userId: number): void {
  //   const localCart = this.getCartFromLocalStorage();
  //   if (localCart.length > 0) {
  //     localCart.forEach((item) => {
  //       this.addToCart(userId, item.id)?.subscribe();
  //     });
  //     this.clearLocalStorageCart();
  //   }
  // }


  // cart.service.ts
syncLocalCartToDatabase(userId: string, cartItems: any[]) {
  // Call the backend API to save cart items for the user
  this.http.post(`http://localhost:3000/api/cart/add`, { userId, items: cartItems }).subscribe(
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

