import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectiveDTO } from '../Models/objective.dto';
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

export class ObjectiveService {
  
  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getAllObjectives(): Observable<ObjectiveDTO[]> {
    return this.http
      .get<ObjectiveDTO[]>(`${URL_API_SRV}/api/get-all-Objectives`, httpOptions)

  }

  getAllObjectivesByCompanyAndAspect(companyId:any, aspectId?: number): Observable<ObjectiveDTO[]> {
    return this.http
     /* .get<ObjectiveDTO[]>(`${URL_API_SRV}/api/get-all-company-aspect-Objectives/${companyId}/${aspectId}`, httpOptions) */
     .get<ObjectiveDTO[]>(`${URL_API}objectiveGetByCompanyId.php?companyId=${companyId}&aspectId=${aspectId}`, httpOptions)
  }

  getAllObjectivesByCompany(companyId:string): Observable<ObjectiveDTO[]> {
    if (companyId) {
      console.log ("logged in")
      return this.http
        .get<ObjectiveDTO[]>(`${URL_API}objectiveGetByCompanyId.php?companyId=${companyId}`)
    } else {
      console.log("NOT logged")
      return this.http
        .get<ObjectiveDTO[]>(`${URL_API_SRV}/api/get-all-Objectives`, httpOptions)
    }
  }

  getObjectivesById(consumptionId: string): Observable<ObjectiveDTO> {
    return this.http
    .get<ObjectiveDTO>(`${URL_API}energyConsumptionGetByConsumptionId.php?consumptionId=${consumptionId}`)
  }

  createEnergyConsumption(energyConsumption: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      .post<ObjectiveDTO>(`${URL_API}energyConsumptionCreate.php`, energyConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createWaterConsumption(waterConsumption: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      .post<ObjectiveDTO>(`${URL_API}waterConsumptionCreate.php`, waterConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createResidueConsumption(residueConsumption: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      .post<ObjectiveDTO>(`${URL_API}residueConsumptionCreate.php`, residueConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  createEmissionConsumption(residueConsumption: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      .post<ObjectiveDTO>(`${URL_API}emissionConsumptionCreate.php`, residueConsumption)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateObjectives(consumptionId: string, consumption: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      .put<ObjectiveDTO>(`${URL_API}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption)
  }

  deleteObjective(objectiveId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}objectiveDelete.php?objectiveId=${objectiveId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }  

}
