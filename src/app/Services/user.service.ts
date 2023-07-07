import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO } from '../Models/user.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBlogUocApi: string;
  private controller: string;
  private urlAPiMySql:  string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'users';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
    this.urlAPiMySql = '../../assets/phpAPI/'
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http
      .post<UserDTO>(this.urlBlogUocApi, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(this.urlBlogUocApi + '/' + userId, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUserMySQL(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(`${this.urlAPiMySql}userUpdate.php?userId=${userId}`, user)
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
}
