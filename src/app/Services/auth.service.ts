import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { AuthDTO } from '../Models/auth.dto';
import { SharedService } from './shared.service';

export interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;
  private urlAPiMySql:  string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'auth';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
    this.urlAPiMySql = '../../assets/phpAPI/'
  }

/*   login(auth: AuthDTO): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(this.urlBlogUocApi, auth)
      .pipe(catchError(this.sharedService.handleError));
  } */

/*     login(auth:AuthDTO): Observable<AuthToken> {
      return this.http
        .post<AuthToken>(`${this.urlAPiMySql}authUser.php`, auth)
        .pipe(
          tap(data => console.log('tap '+data)), 
          catchError(this.sharedService.handleError)
          )
      } */

      loginp(auth: AuthDTO): Promise<AuthToken> {
        return this.http.post<AuthToken>(`${this.urlAPiMySql}userAuth.php`, auth).toPromise();
      }

}
