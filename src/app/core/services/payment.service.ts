import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CreatePaymentOrderResponse {
  orderId: number;
  keyId: string;
  razorpayOrderId: string;
  amount: number;
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

  private readonly API_URL = `${environment.apiUrl}/api/payments`;

  createPaymentOrder(): Observable<CreatePaymentOrderResponse> {
    return this.http.post<CreatePaymentOrderResponse>(
      `${this.API_URL}/create-order`,
      {},
    );
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<string> {
    return this.http.post(`${this.API_URL}/verify`, request, {
      responseType: 'text',
    });
  }
}
