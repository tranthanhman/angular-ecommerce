import { Component, inject, OnInit, signal } from '@angular/core';
import { HomeCategoriesComponent } from './components/categories/categories.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Category } from '@models/category';
import { CategoryService } from '@services/category.service';
import { ProductService } from '@services/product.service';
import { Product } from '@models/product.model';

@Component({
  selector: 'app-home',
  imports: [HomeCategoriesComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent implements OnInit {
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((res) => {
      if (res.statusCode === 200 && res.success) {
        const { data } = res;
        if (data.products.length > 0) {
          this.products.set(data.products);
        }
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res) => {
      if (res.success && res.statusCode === 200) {
        const { categories } = res.data;
        this.categories.set(categories);
      }
    });
  }

  ngOnInit(): void {
    console.log('init homepage');
    this.loadCategories();
    this.loadProducts();
  }
}
