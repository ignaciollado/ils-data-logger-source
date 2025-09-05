import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ConsumptionDTO } from '../Models/consumption.dto';
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

export class ConsumptionService {

  private urlAPiMySql:  string;
  private apiUrl = 'https://tramits.idi.es/public/index.php/api';

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllConsumptions(): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${URL_API_SRV}/api/get-all-consumptions`, httpOptions)
  }

  getAllConsumptionsByCompanyAndAspect(companyId:any, aspectId?: number): Observable<ConsumptionDTO[]> {
    return this.http
     .get<ConsumptionDTO[]>(`${this.apiUrl}/ilsconsumption/${companyId}/${aspectId}`, httpOptions)
  }

  getAllConsumptionsByCompany(companyId:string): Observable<ConsumptionDTO[]> {
    if (companyId) {
      console.log ("logged in")
      return this.http
        .get<ConsumptionDTO[]>(`${URL_API}consumptionGetByCompanyId.php?companyId=${companyId}`)
    } else {
      console.log("NOT logged")
      return this.http
        .get<ConsumptionDTO[]>(`${URL_API_SRV}/api/get-all-consumptions`, httpOptions)
    }
  }

/*   getYearlyEnergyByCompanyId(companyId:string): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${URL_API}graphEnergyYearlyGetByCompanyId.php?companyId=${companyId}`)
  } */

  getYearlyEnergyByCompanyId(companyId:string): Observable<ConsumptionDTO[]> {
    return this.http.get<ConsumptionDTO[]>(`${this.apiUrl}/ilsconsumption/company/${companyId}`)
  }

  /*   getQuarterlyEnergyByCompanyId(companyId:string): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${URL_API}graphEnergyQuarterlyGetByCompanyId.php?companyId=${companyId}`)
  } */

  getQuarterlyEnergyByCompanyId(companyId:string): Observable<ConsumptionDTO[]> {
    return this.http.get<ConsumptionDTO[]>(`${this.apiUrl}/ilsconsumption/company/quarterly/${companyId}`)
  }

  /*   getMonthlyEnergyByCompanyId(companyId:string): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${URL_API}graphEnergyMonthlyGetByCompanyId.php?companyId=${companyId}`)
  } */

  getMonthlyEnergyByCompanyId(companyId:string): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${this.apiUrl}/ilsconsumption/company/monthly/${companyId}`)
  }      

  getConsumptionsById(consumptionId: string): Observable<ConsumptionDTO> {
    return this.http
    .get<ConsumptionDTO>(`${URL_API}energyConsumptionGetByConsumptionId.php?consumptionId=${consumptionId}`)
  }

  getAllResiduesByCompany(companyId:any, aspectId?: number): Observable<ConsumptionDTO[]> {
    return this.http
     .get<ConsumptionDTO[]>(`${URL_API}residueConsumptionGetByCompanyId.php?companyId=${companyId}&aspectId=${aspectId}`, httpOptions)
  }

  createEnergyConsumption(energyConsumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .post<ConsumptionDTO>(`${URL_API}energyConsumptionCreate.php`, energyConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createWaterConsumption(waterConsumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .post<ConsumptionDTO>(`${URL_API}waterConsumptionCreate.php`, waterConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createResidueConsumption(residueConsumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    console.log (residueConsumption)
    return this.http
     /*  .post<ConsumptionDTO>(`${URL_API}waterConsumptionCreate.php`, residueConsumption) */
     .post<ConsumptionDTO>(`${URL_API}residueConsumptionCreate.php`, residueConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createEmissionConsumption(emissionConsumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .post<ConsumptionDTO>(`${URL_API}emissionConsumptionCreate.php`, emissionConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateConsumptions(consumptionId: string, consumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .put<ConsumptionDTO>(`${URL_API}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption)
  }

  updateEmissionConsumption(consumptionId: string, consumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .put<ConsumptionDTO>(`${URL_API}emissionConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption)
  }

  deleteConsumption(consumptionId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}energyConsumptionDelete.php?consumptionId=${consumptionId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteConsumptions(consumptionData: ConsumptionDTO[]): Observable<ConsumptionDTO[]> {
    return forkJoin(
        consumptionData.map((consumptions) =>
        this.http.delete<ConsumptionDTO>(`${URL_API}consumptionsDataDelete.php?consumptions=${consumptions}`)
      )
    );
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

}
