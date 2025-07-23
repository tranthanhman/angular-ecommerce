import { Routes } from '@angular/router';
import {ProductListComponent} from './pages/home/components/product-list/product-list.component';
import {CartComponent} from './modules/cart/cart.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {ProductDetailComponent} from './modules/product/product-detail/product-detail.component';
import { ProductWithFilterComponent } from './modules/product-with-filter/product-with-filter/product-with-filter.component';
import {HomeComponent} from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'san-pham',
    component: ProductWithFilterComponent,
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
