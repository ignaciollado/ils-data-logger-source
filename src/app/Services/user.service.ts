import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO } from '../Models/user.dto';
import { CnaeDTO } from '../Models/cnae.dto';
import { SharedService } from './shared.service';

const URL_API_SRV = "https://jwt.idi.es/public/index.php"

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain', /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
  })
};

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBlogUocApi: string;
  private controller: string;
  private urlAPiMySql:  string;
  private urlAPiMock:  string;


  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'users';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
    this.urlAPiMySql = '../../assets/phpAPI/'
    this.urlAPiMock = '../../assets/mocks/'
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http
      .post<UserDTO>(`${URL_API_SRV}/api/create-users/`, user, httpOptions)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUserMySQL(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(`${this.urlAPiMySql}userUpdate.php?userId=${userId}`, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUserPindustExpedientes(userId: string, profile: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(`${this.urlAPiMySql}userPindustExpedientesUpdate.php?userId=${userId}`,profile)
      .pipe(catchError(this.sharedService.handleError))
  }

  getAllRegisteredUsers(): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(`${this.urlAPiMySql}userAppSostenibilityList.php`)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUSerById(userId: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlBlogUocApi + '/' + userId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUSerByIdMySQL(userId: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(`${this.urlAPiMySql}userGet.php?userId=${userId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUserCnae(): Observable<CnaeDTO[]> {
    return this.http
      .get<CnaeDTO[]>(`${this.urlAPiMock}cnaeList.json`)
      .pipe(catchError(this.sharedService.handleError))
  }

  deleteUser(userId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlAPiMySql}userAppSostenibiityDelete.php?userId=${userId}`)
      .pipe(catchError(this.sharedService.handleError));
    }
}

