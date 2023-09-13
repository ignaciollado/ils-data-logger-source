import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillingDTO } from '../Models/billing.dto';
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
export class BillingService {

  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllBillingsByCompany(companyId:string): Observable<BillingDTO[]> {
    if (companyId) {
      console.log ("logged IN")
      return this.http
        .get<BillingDTO[]>(`${URL_API}billingGetByCompanyId.php?companyId=${companyId}`)
    } else {
      console.log("NOT logged")
      return this.http
        .get<BillingDTO[]>(`${URL_API_SRV}/api/get-all-billings`, httpOptions)
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

  deleteBilling(Id: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}consumptionDelete.php?consumptionId=${Id}`)
      .pipe(catchError(this.sharedService.handleError));
  }


}
