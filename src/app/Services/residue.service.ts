import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ResidueDTO } from '../Models/residue.dto';
import { Observable } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';
import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';

const httpsOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
   
  })
}

export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResidueService {
  private urlApi: string;
  private urlAPiMySql:  string;

  constructor(private http: HttpClient, private sharedService: SharedService) {  
    this.urlApi = '../../assets/mocks/fuels.json';
    this.urlAPiMySql = '../../assets/phpAPI/'}

  getAllResidues(): Observable<ResidueDTO[]> {
    return this.http
      .get<ResidueDTO[]>(`${this.urlAPiMySql}residueGetAll.php`)
  }

  getResidueById(residueId: string): Observable<ResidueDTO> {
    return this.http
      .get<ResidueDTO>(this.urlAPiMySql )
    /*   .get<ResidueDTO>(this.urlAPiMySql + '/' + fuelId) */
  }

  createResidue(residue: ResidueDTO): Observable<ResidueDTO> {
    return this.http
      .post<ResidueDTO>(`${this.urlAPiMySql}residueCreate.php`, residue );
  }

  updateResidue(residueId: string, residue: ResidueDTO): Observable<ResidueDTO> {
    return this.http
      .put<ResidueDTO>(this.urlAPiMySql + '/' + residueId, residue)
      ;
  }

  deleteResidue(residueId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlAPiMySql}residueDelete.php?residueId=${residueId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
