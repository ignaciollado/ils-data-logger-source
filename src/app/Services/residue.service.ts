import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ResidueDTO } from '../Models/residue.dto';
import { Observable, forkJoin } from 'rxjs';
import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';
import { ResidueLERDTO } from '../Models/residueLER.dto';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"

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
  private urlApi: string
  private urlAPiMySql:  string
  private urlAPiMock: string

  constructor(private http: HttpClient, private sharedService: SharedService) {  
    this.urlApi = '../../assets/mocks/fuels.json'
    this.urlAPiMySql = '../../assets/phpAPI/'
    this.urlAPiMock = '../../assets/mocks/'
  }

  getAllResidues(): Observable<ResidueDTO[]> {
    return this.http
      .get<ResidueDTO[]>(`${URL_API}residueGetAll.php`)
  }

  getResidueById(residueId: string): Observable<ResidueDTO> {
    return this.http
      .get<ResidueDTO>(URL_API )
    /*   .get<ResidueDTO>(this.urlAPiMySql + '/' + fuelId) */
  }

  createResidue(residue: ResidueDTO): Observable<ResidueDTO> {
    return this.http
      .post<ResidueDTO>(`${URL_API}residueCreate.php`, residue );
  }

  updateResidue(residueId: string, residue: ResidueDTO): Observable<ResidueDTO> {
    return this.http
      .put<ResidueDTO>(URL_API + '/' + residueId, residue)
      ;
  }

  deleteResidue(residueId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}residueDelete.php?residueId=${residueId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  getResiduesLER(): Observable<ResidueLERDTO[]> {
    return this.http
      .get<ResidueLERDTO[]>(`${this.urlAPiMock}residueList.json`)
      .pipe(catchError(this.sharedService.handleError))

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
