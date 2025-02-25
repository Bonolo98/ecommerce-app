import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { CartItem } from '../cart/cart.component';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  // BehaviorSubject to store cart state
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // addToCart(userId: number | null, product: any): Observable<any> {
  //   console.log(userId);
  //   const productId = product.id;
  
  //   if (userId) {
  //     return this.http.post(`${this.apiUrl}/add`, {
  //       userId,
  //       items: [{ productId, quantity: 1 }]
  //     });
  //   } else {
  //     let cart = this.getCartFromLocalStorage();
  //     const existingItem = cart.find((item: any) => item.id === productId);
  
  //     if (existingItem) {
  //       existingItem.quantity += 1;
  //     } else {
  //       cart.push({ id: productId, quantity: 1, name: product.name, price: product.price, image: product.image });
  //     }
  
  //     this.saveCartToLocalStorage(cart);
  //     this.cartSubject.next(cart);
  //     return new Observable((observer) => {
  //       observer.next();
  //       observer.complete();
  //     });
  //   }
  // }

  addToCart(userId: number | null, product: any): Observable<any> {
    const productId = product.id;  // This is fine, but ensure consistency in the cart as well
    console.log(productId);
  
    if (userId) {
      return this.http.post(`${this.apiUrl}/add`, {
        userId,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      let cart = this.getCartFromLocalStorage();
      const existingItem = cart.find((item: any) => item.productId === productId);  // Use productId for consistency
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId,  // Ensure this is productId to match backend
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image
        });
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
    this.getCart(userId).subscribe(
      (data) => {
        if (data && data.cart) {
          this.cartSubject.next(data.cart);
        } else {
          console.error('Cart data is invalid:', data);
        }
      },
      (error) => {
        console.error('Error fetching cart data:', error);
      }
    );
  }
  
  saveCartToLocalStorage(cartItems: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  // getCartFromLocalStorage(): any[] {
  //   return JSON.parse(localStorage.getItem('cart') || '[]');
  // }

  getCartFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]').map((item: any) => ({
      ...item,
      productId: item.productId // Ensure consistency here as well
    }));
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

  removeFromCart(userId: number | null, productId: number): Observable<any> | void {
    if (userId) {
      return this.http.delete(`${this.apiUrl}/${userId}`, {
        body: { productId },
      });
    } else {
      let cart = this.getCartFromLocalStorage();
      cart = cart.filter((item: any) => item.id !== productId);
      this.saveCartToLocalStorage(cart);
      return;
    }
  }
  


// syncLocalCartToDatabase(userId: string, cartItems: any[]) {
//   const itemsToSync = cartItems.map((item: any) => ({
//     productId: item.id,
//     quantity: item.quantity
//   }));

//   this.http.post(`${this.apiUrl}/add`, { userId ,items: itemsToSync }).subscribe(
//     (response) => {
//       console.log('Cart synced successfully');
//       console.log();
//       localStorage.removeItem('cart');
//     },
//     (error) => {
//       console.error('Error syncing cart', error);
//     }
//   );
// }

syncLocalCartToDatabase(userId: string, cartItems: any[]) {
  const itemsToSync = cartItems.map((item: any) => ({
    productId: item.productId,  // Use productId consistently
    quantity: item.quantity
  }));

  this.http.post(`${this.apiUrl}/add`, { userId, items: itemsToSync }).subscribe(
    (response) => {
      console.log('Cart synced successfully');
      localStorage.removeItem('cart');
    },
    (error) => {
      console.error('Error syncing cart', error);
    }
  );
}

}

