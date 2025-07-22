import { Component, inject, input } from '@angular/core';
import { Product } from '../../../models/product.model';
import {CartService} from '../../../services/cart.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styles: ``,
})
export class ProductCardComponent {
  product = input.required<Product>();
  cartService = inject(CartService)
}
