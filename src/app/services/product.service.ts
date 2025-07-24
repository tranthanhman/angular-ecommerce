import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductResponse } from '@models/product.model';
import { ApiResponse } from '@utils/api';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = `${environment.apiUrl}/ecommerce/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(
    page: number = 1,
    limit: number = 8
  ): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(
      `${this.url}?page=${page}&limit=${limit}`
    );
  }

  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.url}/${id}`);
  }

  getProductsByCategoryId(
    categoryId: string,
    page: number = 1,
    limit: number = 5
  ): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(
      `${this.url}/category/${categoryId}?page=${page}&limit=${limit}`
    );
  }
}
