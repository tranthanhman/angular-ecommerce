import { Component, signal } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styles: ``,
})
export class ProductListComponent {
  async ngOnInit() {
    try {
      const res = await fetch(
        'https://api.freeapi.app/api/v1/ecommerce/products?page=1&limit=10'
      ).then((res) => res.json());

      if (res.statusCode === 200 && res.success) {
        this.products.set(res.data.products);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  products = signal<Product[]>([]);
}
