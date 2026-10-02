import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Plant } from '../models/plant';
import { Observable } from 'rxjs';
import { environment } from '../../src/environments/environment';
import { PageResponse } from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/api/plants`;

  getPlants(
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Plant>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<PageResponse<Plant>>(this.API_URL, { params });
  }

  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.API_URL}/${id}`);
  }

  searchPlants(
    name: string,
    page: number = 0,
    size: number = 8,
  ): Observable<PageResponse<Plant>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Plant>>(`${this.API_URL}/search`, {
      params,
    });
  }
}
