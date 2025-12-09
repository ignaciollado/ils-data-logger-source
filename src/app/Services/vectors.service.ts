import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { catchError, Observable } from 'rxjs';
import { VectorDTO } from '../Models/vector.dto';
import { deleteResponse } from './energy.service';

@Injectable({
  providedIn: 'root'
})
export class VectorsService {
  private urlApi: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.urlApi = 'https://tramits.idi.es/public/index.php'
  }

  /* CRUD */

  // GET ALL
  getAllVectors(): Observable<VectorDTO[]> {
    return this.http.get<VectorDTO[]>(`${this.urlApi}/api/vectors`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY ID
  getOneVector(id: number): Observable<VectorDTO> {
    return this.http.get<VectorDTO>(`${this.urlApi}/api/vectors/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // CREATE
  createVector(vector: VectorDTO): Observable<VectorDTO> {
    return this.http.post<VectorDTO>(`${this.urlApi}/api/vectors`, vector)
      .pipe(catchError(this.sharedService.handleError))
  }

  // UPDATE
  updateVector(id: number, vector: VectorDTO): Observable<VectorDTO> {
    return this.http.put<VectorDTO>(`${this.urlApi}/api/vectors/${id}`, vector)
      .pipe(catchError(this.sharedService.handleError));
  }

  // DELETE
  deleteVector(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/api/vectors/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }
}
