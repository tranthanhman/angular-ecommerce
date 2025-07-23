import { Component, OnInit, signal } from '@angular/core';
import { CategoryService } from '@services/category.service';
import { Category } from '@models/category';

@Component({
  selector: 'app-home-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styles: ``,
})
export class HomeCategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);

  constructor(private categoryService: CategoryService) {}

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((res) => {
      if (res.success && res.statusCode === 200) {
        const { categories } = res.data;
        this.categories.set(categories);
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }
}
