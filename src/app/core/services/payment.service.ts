import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../src/environments/environment';

export interface CreatePaymentOrderResponse {
  orderId: number;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/payments`;

  createPaymentOrder(orderId: number): Observable<CreatePaymentOrderResponse> {
    return this.http.post<CreatePaymentOrderResponse>(
      `${this.apiUrl}/create-order/${orderId}`,
      {},
    );
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/verify`, request);
  }
}
