import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product';
import { environment } from '../../src/environments/environment';
import { PageResponse } from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/products`;

  // getProducts(page: number = 0, size: number = 8): Observable<Array<Product>> {
  //   const params = new HttpParams().set('page', page).set('size', size);

  //   return this.http.get<Array<Product>>(this.apiUrl, { params });
  // }

  //   getProducts() {
  //   return this.http.get<PageResponse<Product>>(this.apiUrl);
  // }

  getProducts(
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<PageResponse<Product>>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(
    name: string,
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Product>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Product>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  getProductsByCategory(
    category: string,
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Product>> {
    const params = new HttpParams()
      .set('category', category)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Product>>(`${this.apiUrl}/category`, {
      params,
    });
  }
}
