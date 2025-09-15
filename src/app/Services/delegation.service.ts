import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DelegationDTO, MunicipalityDto } from '../Models/delegation.dto';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from './shared.service';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'text/plain' /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
  })
};

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class DelegationService {
  private urlAPiMySql:  string;
  private urlAPiMock: string
  private apiUrl = 'https://tramits.idi.es/public/index.php/api';

    constructor(private http: HttpClient,
      private sharedService: SharedService) {
      this.urlAPiMySql = '../../assets/phpAPI/'
      this.urlAPiMock = '../../assets_auto/jsons/'
  }

  getAllDelegationsByCompanyIdFromMySQL (companyId: string): Observable<DelegationDTO[]> {
    return this.http
      .get<DelegationDTO[]>(`${this.apiUrl}/ilscompanydelegation/${companyId}`)
  }

  /*   getTotalDelegationsByCompany (companyId: string): Observable<any> {
    return this.http
      .get<any>(`${this.urlAPiMySql}delegationCountByCompany.php?companyId=${companyId}`)
  } */

  getTotalDelegationsByCompany (companyId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/ilscompanydelegationcount/${companyId}`)
  }     

  /*   getMunicipalities(): Observable<MunicipalityDto[]> {
    return this.http
      .get<MunicipalityDto[]>(`${this.urlAPiMock}municipios.json`)
      .pipe(catchError(this.sharedService.handleError))
  } */

  getMunicipalities(): Observable<MunicipalityDto[]> {
    return this.http
      .get<MunicipalityDto[]>(`${this.apiUrl}/municipios`)
      .pipe(catchError(this.sharedService.handleError))
  }      

  createDelegation(delegation: DelegationDTO): Observable<DelegationDTO> {
    return this.http
      .post<DelegationDTO>(`${this.urlAPiMySql}delegationCreate.php`, delegation)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteDelegation(companyDelegationId: string): Observable<deleteResponse> {
    return this.http
      /* .delete<deleteResponse>(`${URL_API_SRV}/api/delete-company-delegation/${companyDelegationId}`, httpOptions) */
      .delete<deleteResponse>(`${URL_API}delegationDelete.php?companyDelegationId=${companyDelegationId}`)
      .pipe(catchError(this.sharedService.handleError));
  }
}
