import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Article, ArticleRequest } from '../models/article';
import { environment } from '../../../../environments/environment';
import { PageResponse } from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/articles`;

  getArticles(
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Article>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<PageResponse<Article>>(this.apiUrl, { params });
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  searchArticles(
    title: string,
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Article>> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Article>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  createArticle(request: ArticleRequest): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, request);
  }

  updateArticle(id: number, request: ArticleRequest): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, request);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
