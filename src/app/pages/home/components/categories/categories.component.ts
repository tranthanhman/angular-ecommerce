import { Component, input, OnInit } from '@angular/core';
import { Category } from '@models/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styles: ``,
})
export class HomeCategoriesComponent implements OnInit {
  categories = input.required<Category[] | null>();

  ngOnInit(): void {
    console.log('init component home categories');
  }
}
