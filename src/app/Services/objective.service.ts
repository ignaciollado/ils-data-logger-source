import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ObjectiveDTO } from '../Models/objective.dto';
import { SharedService } from './shared.service';
import { catchError } from 'rxjs/operators';

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

private URL_API: string = '../../assets/phpAPI/'
private URL_API_SRV: string = "https://jwt.idi.es/public/index.php"
private URL_MOCKS: string = '../../assets/mocks/consumptions.json'

  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) { }

  getAllObjectives(): Observable<ObjectiveDTO[]> {
    return this.http
      .get<ObjectiveDTO[]>(`${this.URL_API_SRV}/api/get-all-Objectives`, httpOptions)

  }

  getAllEnvironmentalData(): Observable<ObjectiveDTO[]> {
    return this.http
      .get<ObjectiveDTO[]>(`${this.URL_API}environmentalDataGetAll.php`, httpOptions)
  }

  getAllObjectivesByCompanyAndAspect(companyId:any, aspectId?: number): Observable<ObjectiveDTO[]> {
    return this.http
     /* .get<ObjectiveDTO[]>(`${URL_API_SRV}/api/get-all-company-aspect-Objectives/${companyId}/${aspectId}`, httpOptions) */
     .get<ObjectiveDTO[]>(`${this.URL_API}objectiveGetByCompanyId.php?companyId=${companyId}&aspectId=${aspectId}`, httpOptions)
  }

  getAllObjectivesByCompany(companyId:string): Observable<ObjectiveDTO[]> {
    if (companyId) {
      console.log ("logged in")
      return this.http
        .get<ObjectiveDTO[]>(`${this.URL_API}objectiveGetByCompanyId.php?companyId=${companyId}`)
    } else {
      console.log("NOT logged")
      return this.http
        .get<ObjectiveDTO[]>(`${this.URL_API_SRV}/api/get-all-Objectives`, httpOptions)
    }
  }

  getObjectiveById(consumptionId: string): Observable<ObjectiveDTO> {
    return this.http
    .get<ObjectiveDTO>(`${this.URL_API}energyConsumptionGetByConsumptionId.php?consumptionId=${consumptionId}`)
  }

  createObjective(objective: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      .post<ObjectiveDTO>(`${this.URL_API}objectiveCreate.php`, objective);
  }


  updateObjective(objectiveId: number, objective: ObjectiveDTO): Observable<ObjectiveDTO> {
    return this.http
      /* .put<ObjectiveDTO>(`${this.URL_API}energyConsumptionUpdate.php?consumptionId=${consumptionId}`, consumption) */
      .patch<ObjectiveDTO>(`${this.URL_API}objectiveUpdate.php?objectiveId=${objectiveId}`, objective)
  }

  deleteObjective(objectiveId: number): Observable<deleteResponse> {
    console.log (objectiveId)
    return this.http
      .delete<deleteResponse>(`${this.URL_API}objectiveDelete.php?objectiveId=${objectiveId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteObjectives(objectives: ObjectiveDTO[]): Observable<ObjectiveDTO[]> {
    return forkJoin(
      objectives.map((objective) =>
        this.http.delete<ObjectiveDTO>(`${this.URL_API}objectivesDelete.php?objectives=${objective.Id}`)
      )
    );
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

}
