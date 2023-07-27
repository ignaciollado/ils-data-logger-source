import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DelegationDTO } from '../Models/delegation.dto';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NONE_TYPE } from '@angular/compiler';
import { SharedService } from './shared.service';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php" /* https://jwt.idi.es/public/index.php/api/login-users */

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'text/plain'
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

    constructor(private http: HttpClient,
      private sharedService: SharedService) {  
    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllDelegationsByCompanyIdFromMySQL (companyId: string): Observable<DelegationDTO[]> {
    return this.http
      .get<DelegationDTO[]>(`${this.urlAPiMySql}delegationGetByCompany.php?companyId=${companyId}`)
  }

  getTotalDelegationsByCompany (companyId: string): Observable<any> {
    return this.http
      .get<any>(`${this.urlAPiMySql}delegationCountByCompany.php?companyId=${companyId}`)
  }

  createDelegation(delegation: DelegationDTO): Observable<DelegationDTO> {
    return this.http
      .post<DelegationDTO>(`${this.urlAPiMySql}delegationCreate.php`, delegation)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteDelegation(companyDelegationId: string): Observable<deleteResponse> {
    return this.http
      /* .delete<deleteResponse>(`${this.urlAPiMySql}delegationDeleteByCompany.php?companyId=${companyDelegationId}`) */
      .delete<deleteResponse>(`${URL_API_SRV}/api/delete-company-delegation/${companyDelegationId}`)
      .pipe(catchError(this.sharedService.handleError));
  }
}
