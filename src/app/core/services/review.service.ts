import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Review, ReviewRequest } from '../models/review';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/api/products`;

  createReview(productId: number, request: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(
      `${this.API_URL}/${productId}/reviews`,
      request,
    );
  }

  updateReview(
    productId: number,
    reviewId: number,
    request: ReviewRequest,
  ): Observable<Review> {
    return this.http.put<Review>(
      `${this.API_URL}/${productId}/reviews/${reviewId}`,
      request,
    );
  }

  getReviews(productId: number) {
    return this.http.get<Review[]>(`${this.API_URL}/${productId}/reviews`);
  }

  addReview(productId: number, request: ReviewRequest) {
    return this.http.post<Review>(
      `${this.API_URL}/${productId}/reviews`,
      request,
    );
  }

  deleteReview(productId: number, reviewId: number) {
    return this.http.delete<void>(
      `${this.API_URL}/${productId}/reviews/${reviewId}`,
    );
  }
}
