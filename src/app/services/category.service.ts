import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '@utils/api';
import {CategoryResponse} from '@models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = `${environment.apiUrl}/ecommerce/categories?page=1&limit=10`;

  constructor(private http: HttpClient) { }


  getCategories(): Observable<ApiResponse<CategoryResponse>> {
    return this.http.get<ApiResponse<CategoryResponse>>(this.url);
  }
}
