import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IlsService {

  private apiUrl = 'https://tramits.idi.es/public/index.php/api';

  constructor(private http: HttpClient) { }

  // ================= CRUD GENERICO =================
  getAll(entity: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}`)
      .pipe(catchError(this.handleError));
  }

  getById(entity: string, id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${entity}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(entity: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${entity}`, data)
      .pipe(catchError(this.handleError));
  }

  update(entity: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${entity}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  delete(entity: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${entity}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ================= Manejo de errores =================
  private handleError(error: HttpErrorResponse) {
    let errorMsg = '';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMsg = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
