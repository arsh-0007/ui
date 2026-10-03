import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cart, AddToCartRequest } from '../models/cart';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/api/cart`;

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.API_URL}/items`, request);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.API_URL);
  }

  updateQuantity(productId: number, quantity: number): Observable<Cart> {
    const params = new HttpParams().set('quantity', quantity);

    return this.http.put<Cart>(`${this.API_URL}/items/${productId}`, null, {
      params,
    });
  }

  removeItem(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.API_URL}/items/${productId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.API_URL);
  }
}
