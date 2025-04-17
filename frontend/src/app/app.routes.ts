import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthRestrictGuard } from './guards/auth-restrict.guard';
import { WishlistComponent } from './wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthRestrictGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthRestrictGuard] },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent},
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  ];
