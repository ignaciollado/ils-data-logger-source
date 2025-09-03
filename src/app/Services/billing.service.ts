import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { BillingDTO } from '../Models/billing.dto';
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
export class BillingService {
  private apiUrl = 'https://tramits.idi.es/public/index.php/api';
  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getBillingsByCompany(companyId:string): Observable<BillingDTO[]> {
    if (companyId) {
      console.log ("logged INNN", companyId)
      return this.http
        .get<BillingDTO[]>(`${this.apiUrl}/ilsbilling/${companyId}`) 
    } else {
      console.log("NOTTT logged")
      return this.http
        .get<BillingDTO[]>(`${this.apiUrl}/ilsbilling`, httpOptions)
    }
  }

  getBillingById(billingId: string): Observable<BillingDTO> {
    return this.http
    .get<BillingDTO>(`${URL_API}billingGetById.php?billingId=${billingId}`)
  }

  createBilling(billingObj: BillingDTO): Observable<BillingDTO> {
    return this.http
      .post<BillingDTO>(`${URL_API}billingCreate.php`, billingObj)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateBilling(billingId: number, billing: BillingDTO): Observable<BillingDTO> {
    return this.http
      /* .put<BillingDTO>(`${this.URL_API}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption) */
      .patch<BillingDTO>(`${URL_API}billingUpdate.php?billingId=${billingId}`, billing)
  }

  deleteBilling(Id: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}billingDelete.php?Id=${Id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteBillings(billings: BillingDTO[]): Observable<BillingDTO[]> {
    return forkJoin(
      billings.map((objective) =>
        this.http.delete<BillingDTO>(`${URL_API}billingsDelete.php?billings=${billings}`)
      )
    );
  }

  getYearBillingByCompanyId(companyId:string, delegation:string): Observable<BillingDTO[]> {
    return this.http
      .get<BillingDTO[]>(`${URL_API}graphProductionBillingYearlyGetByCompanyId.php?companyId=${companyId}&delegation=${delegation}`)
  }
  getQuarterBillingByCompanyId(companyId:string, delegation:string): Observable<BillingDTO[]> {
    return this.http
      .get<BillingDTO[]>(`${URL_API}graphProductionBillingYearlyGetByCompanyId.php?companyId=${companyId}&delegation=${delegation}`)
  }
}
