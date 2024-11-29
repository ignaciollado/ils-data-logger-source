import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
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

  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllNormativeText(): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API_SRV}/api/get-all-consumptions`, httpOptions)
  }

  getAllConsumptionsByCompanyAndAspect(companyId:any, aspectId?: number): Observable<NormativeTextDTO[]> {
    return this.http
     /* .get<NormativeTextDTO[]>(`${URL_API_SRV}/api/get-all-company-aspect-consumptions/${companyId}/${aspectId}`, httpOptions) */
     .get<NormativeTextDTO[]>(`${URL_API}consumptionGetByCompanyId.php?companyId=${companyId}&aspectId=${aspectId}`, httpOptions)
  }

  getAllConsumptionsByCompany(companyId:string): Observable<NormativeTextDTO[]> {
    if (companyId) {
      console.log ("logged in")
      return this.http
        .get<NormativeTextDTO[]>(`${URL_API}consumptionGetByCompanyId.php?companyId=${companyId}`)
    } else {
      console.log("NOT logged")
      return this.http
        .get<NormativeTextDTO[]>(`${URL_API_SRV}/api/get-all-consumptions`, httpOptions)
    }
  }

  getYearlyEnergyByCompanyId(companyId:string): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API}graphEnergyYearlyGetByCompanyId.php?companyId=${companyId}`)
  }

  getQuarterlyEnergyByCompanyId(companyId:string): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API}graphEnergyQuarterlyGetByCompanyId.php?companyId=${companyId}`)
  }

  getMonthlyEnergyByCompanyId(companyId:string): Observable<NormativeTextDTO[]> {
    return this.http
      .get<NormativeTextDTO[]>(`${URL_API}graphEnergyMonthlyGetByCompanyId.php?companyId=${companyId}`)
  }

  getConsumptionsById(consumptionId: string): Observable<NormativeTextDTO> {
    return this.http
    .get<NormativeTextDTO>(`${URL_API}energyConsumptionGetByConsumptionId.php?consumptionId=${consumptionId}`)
  }

  getAllResiduesByCompany(companyId:any, aspectId?: number): Observable<NormativeTextDTO[]> {
    return this.http
     /* .get<NormativeTextDTO[]>(`${URL_API_SRV}/api/get-all-company-aspect-consumptions/${companyId}/${aspectId}`, httpOptions) */
     .get<NormativeTextDTO[]>(`${URL_API}residueConsumptionGetByCompanyId.php?companyId=${companyId}&aspectId=${aspectId}`, httpOptions)
  }

  createEnergyConsumption(energyConsumption: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .post<NormativeTextDTO>(`${URL_API}energyConsumptionCreate.php`, energyConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createWaterConsumption(waterConsumption: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .post<NormativeTextDTO>(`${URL_API}waterConsumptionCreate.php`, waterConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createResidueConsumption(residueConsumption: NormativeTextDTO): Observable<NormativeTextDTO> {
    console.log (residueConsumption)
    return this.http
     /*  .post<NormativeTextDTO>(`${URL_API}waterConsumptionCreate.php`, residueConsumption) */
     .post<NormativeTextDTO>(`${URL_API}residueConsumptionCreate.php`, residueConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createEmissionConsumption(emissionConsumption: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .post<NormativeTextDTO>(`${URL_API}emissionConsumptionCreate.php`, emissionConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateConsumptions(consumptionId: string, consumption: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .put<NormativeTextDTO>(`${URL_API}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption)
  }

  updateEmissionConsumption(consumptionId: string, consumption: NormativeTextDTO): Observable<NormativeTextDTO> {
    return this.http
      .put<NormativeTextDTO>(`${URL_API}emissionConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption)
  }

  deleteConsumption(consumptionId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}energyConsumptionDelete.php?consumptionId=${consumptionId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteConsumptions(consumptionData: NormativeTextDTO[]): Observable<NormativeTextDTO[]> {
    return forkJoin(
        consumptionData.map((consumptions) =>
        this.http.delete<NormativeTextDTO>(`${URL_API}consumptionsDataDelete.php?consumptions=${consumptions}`)
      )
    );
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

}
