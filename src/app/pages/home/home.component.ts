import { Component, OnInit } from '@angular/core';
import { HomeCategoriesComponent } from './components/categories/categories.component';
import { ProductListComponent } from './components/product-list/product-list.component';

@Component({
  selector: 'app-home',
  imports: [HomeCategoriesComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('init homepage');
  }
}
