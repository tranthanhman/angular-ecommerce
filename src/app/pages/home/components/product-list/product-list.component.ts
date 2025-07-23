import {Component, signal, OnInit, input} from '@angular/core';
import { ProductCardComponent } from '@modules/product/product-card/product-card.component';
import { Product } from '@models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styles: ``,
})
export class ProductListComponent implements OnInit {
  products = input.required<Product[] | null>();

  ngOnInit(): void {
    console.log('init product listing');
  }
}
