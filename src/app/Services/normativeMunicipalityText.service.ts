import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';
import { NormativeMunicipalityTextDTO } from '../Models/normativeMunicipalityText.dto';

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

export class NormativeMunicipalityTextService {

  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllMunicipalityNormativeText(): Observable<NormativeMunicipalityTextDTO[]> {
    return this.http
      .get<NormativeMunicipalityTextDTO[]>(`${URL_API}getAllMunicipalityNormativeText.php`, httpOptions)
  }

  getAllRegulationIDs(): Observable<NormativeMunicipalityTextDTO[]> {
    return this.http
      .get<NormativeMunicipalityTextDTO[]>(`${URL_API}getAllMunicipalityRegulationIDs.php`, httpOptions)
  }

  createNormativeText(normativeText: NormativeMunicipalityTextDTO): Observable<NormativeMunicipalityTextDTO> {
    console.log(normativeText)
    return this.http
      .post<NormativeMunicipalityTextDTO>(`${URL_API}normativeMunicipalityTextCreate.php`, normativeText)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateNormativeText(normativeTextID: number, normativeText: NormativeMunicipalityTextDTO): Observable<NormativeMunicipalityTextDTO> {
    console.log ("nueva normativa ", normativeText )
    return this.http
      .put<NormativeMunicipalityTextDTO>(`${URL_API}normativeMunicipalityTextUpdate.php?normativeTextID=${normativeTextID}`, normativeText)
  }

  deleteNormativeText(normativeTextID: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}normativeMunicipalityTextDelete.php?normativeTextID=${normativeTextID}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

}
