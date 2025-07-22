import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '@models/product.model';
import {ApiResponse} from '@utils/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }


  getProductById(id: string) {
    return this.http.get<ApiResponse<Product>>(`https://api.freeapi.app/api/v1/ecommerce/products/${id}`);
  }
}
