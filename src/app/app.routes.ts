import { Routes } from '@angular/router';
import {ProductListComponent} from './modules/product/product-list/product-list.component';
import {CartComponent} from './modules/cart/cart.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {ProductDetailComponent} from './modules/product/product-detail/product-detail.component';
import {AuthGuard} from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProductListComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
