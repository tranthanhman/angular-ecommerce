import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@utils/api';
import { HttpClient } from '@angular/common/http';
import {User} from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = `${environment.apiUrl}/ecommerce`;

  constructor(private http: HttpClient) { }

  getProfile(){
    return this.http.get<ApiResponse<User>>(`${this.url}/profile`);
  }
}
