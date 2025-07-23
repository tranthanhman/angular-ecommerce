import { UserService } from './../../services/user.service';
import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Subscription } from 'rxjs';
import {User} from '@models/user.model';
import { CartInfo } from '@models/cart.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styles: `
    .header{
      background : #000000;
      color: #fff;
      padding:1rem;
    }
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartService = inject(CartService);
  authService = inject(AuthService);
  userService = inject(UserService);

  isLoggedIn = signal(this.authService.isLoggedIn());
  user = signal<User | null>(null);
  cart = signal<CartInfo | null>(null);
  cartCount = this.cartService.itemCount;


  private subscriptions: Subscription[] = [];

  getMe() {
    this.userService.getProfile().subscribe((res) => {
      if (res.success) {
        this.user.set(res.data);
      }
    });
  }

  ngOnInit(): void {
    // Lắng nghe user state từ AuthService
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.user.set(user);
      this.isLoggedIn.set(!!user);
    });
    this.subscriptions.push(userSub);

    // Lắng nghe loginSuccess để refetch user profile
    const loginSub = this.authService.loginSuccess$.subscribe(() => {
      this.authService['loadUserProfile']();
    });
    this.subscriptions.push(loginSub);

    // Nếu đã login mà chưa có user thì fetch profile
    if (this.authService.isLoggedIn() && !this.user()) {
      this.authService['loadUserProfile']();
    }

    this.cartService.initializeCart();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
