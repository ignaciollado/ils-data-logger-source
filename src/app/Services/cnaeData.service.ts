import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { CnaeDataDTO } from '../Models/cnaeData.dto';
import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const URL_MOCKS = '../../assets/mocks/billing_SQL.json'

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
export class CnaeDataService {
  private apiUrl = 'https://tramits.idi.es/public/index.php/api';
  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getCnaesDataByCompany(companyId:string): Observable<CnaeDataDTO[]> {
    if (companyId) {
      console.log ("logged INNN", companyId)
      return this.http
        .get<CnaeDataDTO[]>(`${this.apiUrl}/ilscnaes/${companyId}`) 
    } else {
      console.log("NOTTT logged")
      return this.http
        .get<CnaeDataDTO[]>(`${this.apiUrl}/get-all-cnaesData`, httpOptions)
    }
  }

  getCnaesDataById(billingId: string): Observable<CnaeDataDTO> {
    return this.http
    .get<CnaeDataDTO>(`${URL_API}billingGetById.php?billingId=${billingId}`)
  }

  createCnaeData(cnaeData: CnaeDataDTO): Observable<CnaeDataDTO> {
    return this.http
      .post<CnaeDataDTO>(`${URL_API}cnaeDataCreate.php`, cnaeData)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateCnaeData(cnaeDataId: number, cnaeData: CnaeDataDTO): Observable<CnaeDataDTO> {
    return this.http
      /* .put<CnaeDataDTO>(`${this.URL_API}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption) */
      .patch<CnaeDataDTO>(`${URL_API}cnaeDataUpdate.php?cnaeDataId=${cnaeDataId}`, cnaeData)
  }

  deleteCnaeData(Id: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}cnaesDataDelete.php?Id=${Id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteCnaesData(cnaesData: CnaeDataDTO[]): Observable<CnaeDataDTO[]> {
    return forkJoin(
        cnaesData.map((cnaes) =>
        this.http.delete<CnaeDataDTO>(`${URL_API}billingsDelete.php?billings=${cnaes}`)
      )
    );
  }

}
