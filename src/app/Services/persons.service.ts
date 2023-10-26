import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonDTO } from '../Models/person.dto';
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
export class PersonsService {

  private urlAPiMySql:  string;

  constructor(private http: HttpClient,
    private sharedService: SharedService) {

    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  getPersonsByCompany(companyId:string): Observable<PersonDTO[]> {
    if (companyId) {
      console.log ("logged INNN", companyId)
      return this.http
        .get<PersonDTO[]>(`${URL_API}personGetByCompanyId.php?companyId=${companyId}`) 
    } else {
      console.log("NOTTT logged")
      return this.http
        .get<PersonDTO[]>(`${URL_API_SRV}/api/get-all-persons`, httpOptions)
    }
  }

  getPersonById(personId: string): Observable<PersonDTO> {
    return this.http
    .get<PersonDTO>(`${URL_API}personGetById.php?personId=${personId}`)
  }

  createPerson(personObj: PersonDTO): Observable<PersonDTO> {
    return this.http
      .post<PersonDTO>(`${URL_API}personCreate.php`, personObj)
      .pipe(catchError(this.sharedService.handleError));
  }

  deletePerson(Id: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}personDelete.php?Id=${Id}`)
      .pipe(catchError(this.sharedService.handleError));
  }
}
