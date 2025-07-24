import { Routes } from '@angular/router';
import { CartComponent } from './modules/cart/cart.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ProductDetailComponent } from './modules/product/product-detail/product-detail.component';
import { CategoryComponent } from './modules/category/category.component';
import { HomeComponent } from './pages/home/home.component';

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
    path: 'category/:id',
    component: CategoryComponent,
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
