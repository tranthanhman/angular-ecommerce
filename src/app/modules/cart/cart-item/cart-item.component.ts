import { Component, inject, input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CartService } from '../../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CartItem } from '@models/cart.model';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink],
  templateUrl: './cart-item.component.html',
  styles: ``,
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);
}
