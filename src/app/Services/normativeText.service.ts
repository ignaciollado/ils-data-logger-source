import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NormativeTextDTO } from '../Models/normativeText.dto';
import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const URL_MOCKS = '../../assets/mocks/consumptions.json'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain' /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
  })
};

export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})

export class NormativeTextService {
  private apiUrl: string = 'https://tramits.idi.es/public/index.php/api';
  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

/*   getAllNormativeText(): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API}getAllNormativeText.php`, httpOptions)
  } */

    getAllNormativeText(): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${this.apiUrl}/textos-normativos`, httpOptions)
  }


  getAllRegulationIDs(): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API}getAllRegulationIDs.php`, httpOptions)
  }

/*   getAllRegulationScopes(): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API}getAllNormativeTextScopes.php`, httpOptions)
  } */

  getAllRegulationScopes(): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${this.apiUrl}/textos-normativos-scope`, httpOptions)
  }

/*   createNormativeText(normativeText: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .post<NormativeTextDTO>(`${URL_API}normativeTextCreate.php`, normativeText)
      .pipe(catchError(this.sharedService.handleError));
  } */

  createNormativeText(normativeText: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .post<NormativeTextDTO>(`${this.apiUrl}/textos-normativos`, normativeText)
      .pipe(catchError(this.sharedService.handleError));
  }      

  /*   updateNormativeText(normativeTextID: string, normativeText: NormativeTextDTO): Observable<NormativeTextDTO> {
    console.log ("nueva normativa ", normativeText )
    return this.http
      .put<NormativeTextDTO>(`${URL_API}normativeTextUpdate.php?normativeTextID=${normativeTextID}`, normativeText)
  }
 */

  updateNormativeText(idNormativa: number, normativeText: NormativeTextDTO): Observable<NormativeTextDTO> {
    console.log ("nueva normativa backend ", normativeText )
    return this.http
      .put<NormativeTextDTO>(`${this.apiUrl}/textos-normativos/${idNormativa}`, normativeText)
  }

  deleteNormativeText(normativeTextID: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}normativeTextDelete.php?normativeTextID=${normativeTextID}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

}
