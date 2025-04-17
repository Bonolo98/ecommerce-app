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

  private cartItems = [] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any> {
    const cartItems = this.cartCount.next(this.cartItems.length)
    console.log(cartItems);

    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: number | null, product: any): Observable<any> {
    const productId = product.id;
    console.log(productId);

    if (userId) {
      return this.http.post(`${this.apiUrl}/add`, {
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      let cart = this.getCartFromLocalStorage();
      const existingItem = cart.find(
        (item: any) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image,
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

  getCartFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]').map(
      (item: any) => ({
        ...item,
        productId: item.productId,
      })
    );
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

  removeFromCart(
    userId: number | null,
    productId: number
  ): Observable<any> | void {
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

  syncLocalCartToDatabase(userId: string, cartItems: any[]) {
    const itemsToSync = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    this.http
      .post(`${this.apiUrl}/add`, { userId, items: itemsToSync })
      .subscribe(
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
