import { Component, effect, signal, OnInit } from '@angular/core';
import { ProductCardComponent } from '@modules/product/product-card/product-card.component';
import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styles: ``,
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productService: ProductService) {
    // Effect có thể ở đây - đây là pattern đúng cho signals
    effect(() => {
      console.log('Products changed:', this.products());
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe((res) => {
      console.log('res', res);
      if (res.statusCode === 200 && res.success) {
        const { data } = res;
        if (data.products.length > 0) {
          this.products.set(data.products);
        }
      }
    });
  }
}
