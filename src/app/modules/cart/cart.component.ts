import { Component, inject, OnInit, computed } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, OrderSummaryComponent, RouterLink],
  templateUrl: './cart.component.html',
  styles: ``,
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);

  // 📖 Reactive properties từ service
  cart = this.cartService.cart;
  loading = this.cartService.loading;
  error = this.cartService.error;
  itemCount = this.cartService.itemCount;
  isEmpty = this.cartService.isEmpty;

  // 🧮 Local computed properties
  cartSummary = computed(() => ({
    itemCount: this.itemCount(),
    total: this.cart().cartTotal,
    hasItems: !this.isEmpty()
  }));

  ngOnInit(): void {
    console.log('🟢 Cart Component initialized');
  }

  onRefreshCart(): void {
    this.cartService.refreshCart();
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
