import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO } from '../Models/user.dto';
import { CnaeDTO } from '../Models/cnae.dto';
import { SharedService } from './shared.service';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const apiURL = "https://tramits.idi.es/public/index.php"


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain', /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
  })
};

const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, POST, GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'origin, x-requested-with, content-type'
}

const requestOptions = {                                                                                                                                                                                 
  headers: new HttpHeaders(headerDict), 
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
  private urlAPiMySql: string;
  private urlAPiMock: string;


  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'users';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
    this.urlAPiMySql = '../../assets/phpAPI/'
    this.urlAPiMock = '../../assets_auto/jsons/'
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

  getAllRegisteredUsers(): Observable<any[]> {
    return this.http
      .post<any[]>(`${URL_API_SRV}/api/get-all-users`, requestOptions)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUSerById(userId: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlBlogUocApi + '/' + userId)
      .pipe(catchError(this.sharedService.handleError));
  }

/*   getUSerByIdMySQL(userId: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(`${this.urlAPiMySql}userGet.php?userId=${userId}`)
      .pipe(catchError(this.sharedService.handleError));
  } */

  getUSerByIdMySQL(userId: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(`${apiURL}/pindustexpediente/${userId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

/*   getUserCnae(): Observable<CnaeDTO[]> {
    return this.http
      .get<CnaeDTO[]>(`${this.urlAPiMock}cnaeList.json`)
      .pipe(catchError(this.sharedService.handleError))
  } */

  getUserCnae(): Observable<CnaeDTO[]> {
    return this.http
      .get<CnaeDTO[]>(`${apiURL}/pindustactividades`)
      .pipe(catchError(this.sharedService.handleError))
  }

  deleteUser(userId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlAPiMySql}userAppSostenibiityDelete.php?userId=${userId}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  formatDate(fecha: string | Date): string {
  // Convertir string a Date si es necesario
  const dateObj = (typeof fecha === 'string') ? new Date(fecha) : fecha;

  const pad = (n: number) => n < 10 ? '0' + n : n;

  const dia = pad(dateObj.getDate());
  const mes = pad(dateObj.getMonth() + 1);
  const anio = dateObj.getFullYear();

  const horas = pad(dateObj.getHours());
  const minutos = pad(dateObj.getMinutes());

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }

  formatCurrency(importe: number | string): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(importe));
  }  
}

