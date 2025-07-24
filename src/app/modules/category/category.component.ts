import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@modules/product/product-card/product-card.component';

@Component({
  selector: 'app-category',
  imports: [ProductCardComponent],
  templateUrl: './category.component.html',
  styles: [],
})
export class CategoryComponent implements OnInit {
  products = signal<Product[]>([]);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  constructor() {
    // Log whenever products change
    effect(() => {
      console.log('Products:', this.products());
    });
  }

  loadProductsByCategoryId(categoryId: string): void {
    this.productService.getProductsByCategoryId(categoryId).subscribe((res) => {
      if (res.success && res.statusCode === 200) {
        const { products } = res.data;
        this.products.set(products);
      }
    });
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const { id } = params;
    if (id) {
      this.loadProductsByCategoryId(id);
    }
  }
}
