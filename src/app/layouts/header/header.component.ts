import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

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
export class HeaderComponent {
  title = signal('Header');
  cartService = inject(CartService);
}
