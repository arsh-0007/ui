import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageResponse } from '../models/PageResponse';

export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PLACED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PAYMENT_FAILED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export interface AdminOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface AdminOrder {
  orderId: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: AdminOrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/admin/orders`;

  getAllOrders(
    page = 0,
    size = 10,
    keyword?: string,
    status?: OrderStatus,
  ): Observable<PageResponse<AdminOrder>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (keyword?.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<AdminOrder>>(this.apiUrl, { params });
  }

  getOrder(id: number): Observable<AdminOrder> {
    return this.http.get<AdminOrder>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  searchOrders(
    keyword: string,
    page = 0,
    size = 10,
  ): Observable<PageResponse<AdminOrder>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<AdminOrder>>(`${this.apiUrl}/search`, {
      params,
    });
  }
}
