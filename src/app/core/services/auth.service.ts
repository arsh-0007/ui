import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../src/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/api/auth`;

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, request);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const payload = this.getPayload(token);

    if (!payload) {
      return false;
    }

    return payload.exp * 1000 > Date.now();
  }

  isAdmin(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const payload = this.getPayload(token);

    return payload?.role === 'ROLE_ADMIN';
  }

  getRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    return this.getPayload(token)?.role ?? null;
  }

  private getPayload(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];

      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      return JSON.parse(decoded);
    } catch (error) {
      console.error('Invalid JWT', error);

      return null;
    }
  }
}
