import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsumptionDTO } from '../Models/consumption.dto';
import { NONE_TYPE } from '@angular/compiler';
import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {
  private urlApi: string;
  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {  
    this.urlApi = '../../assets/mocks/consumptions.json'
    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllConsumptions(): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${this.urlAPiMySql}energyConsumptionGetAll.php`)  
  }

  getAllConsumptionsByUserIdFromMySQL($companyId:any): Observable<ConsumptionDTO[]> {
    return this.http
      .get<ConsumptionDTO[]>(`${this.urlAPiMySql}energyConsumptionGetByCompanyId.php?companyId=${$companyId}`)
  }

  getConsumptionsById(consumptionId: string): Observable<ConsumptionDTO> {
    return this.http
    .get<ConsumptionDTO>(`${this.urlAPiMySql}energyConsumptionGetByConsumptionId.php?consumptionId=${consumptionId}`) 
  }

  createEnergyConsumption(energyConsumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .post<ConsumptionDTO>(`${this.urlAPiMySql}energyConsumptionCreate.php`, energyConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateConsumptions(consumptionId: string, consumption: ConsumptionDTO): Observable<ConsumptionDTO> {
    return this.http
      .put<ConsumptionDTO>(`${this.urlAPiMySql}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption)
      ;
  }

  deleteConsumptions(msgId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlApi + '/' + msgId)
      ;
  }

}
