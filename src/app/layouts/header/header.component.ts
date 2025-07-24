import { UserService } from './../../services/user.service';
import {
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy,
  effect,
} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@models/user.model';
import { CartInfo } from '@models/cart.model';
import { ProfileComponent } from './components/profile/profile.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ProfileComponent],
  templateUrl: './header.component.html',
  styles: `
    .header{
      background : #000000;
      color: #fff;
      padding:1rem;
    }
  `,
})
export class HeaderComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);

  isLoggedIn = signal(this.authService.isAuthenticated());
  user = signal<User | null>(null);
  cart = signal<CartInfo | null>(null);
  cartCount = this.cartService.itemCount;

  constructor() {
    // Update signals when auth state changes
    effect(() => {
      this.user.set(this.authService.currentUser);
      this.isLoggedIn.set(this.authService.isAuthenticated());
    });
  }

  ngOnInit(): void {
    this.cartService.initializeCart();
  }
}
