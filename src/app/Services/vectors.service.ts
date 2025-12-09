import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VectorsService {
  private apiUrl: string = 'https://tramits.idi.es/public/index.php/api/vectors';

  constructor(private http: HttpClient) {}

  /* CRUD */

  // GET ALL
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // GET BY ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // CREATE
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // UPDATE
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // DELETE
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}