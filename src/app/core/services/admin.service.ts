import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product, ProductRequest } from '../models/product';
import { Plant, PlantRequest } from '../models/plant';
import { ArticleService } from './article.service';
import { Article } from '../models/article';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  private productUrl = `${environment.apiUrl}/api/products`;

  private plantUrl = `${environment.apiUrl}/api/plants`;

  // =========================
  // PRODUCTS
  // =========================

  createProduct(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.productUrl, request);
  }

  updateProduct(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.productUrl}/${id}`, request);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productUrl}/${id}`);
  }

  // =========================
  // PLANTS
  // =========================

  createPlant(request: PlantRequest): Observable<Plant> {
    return this.http.post<Plant>(this.plantUrl, request);
  }

  updatePlant(id: number, request: PlantRequest): Observable<Plant> {
    return this.http.put<Plant>(`${this.plantUrl}/${id}`, request);
  }

  deletePlant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.plantUrl}/${id}`);
  }
}
