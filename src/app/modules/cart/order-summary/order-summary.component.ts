import { Component, computed, inject, input } from '@angular/core';
import {CartInfo} from '@models/cart.model';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-order-summary',
  imports: [],
  templateUrl: './order-summary.component.html',
  styles: ``,
})
export class OrderSummaryComponent {
  cartService = inject(CartService);

  cartInfo = input.required<CartInfo>();

  // total = computed(() => {
  //   let total = 0;
  //   for (const item of this.cartService.cart()) {
  //     total += item.price;
  //   }

  //   return total;
  // });
}
