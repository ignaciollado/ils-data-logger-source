import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { AuthDTO } from '../Models/auth.dto';
import { SharedService } from './shared.service';
import * as moment from 'moment';

export interface AuthToken {
  user_id: string;
  access_token: string;
}

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php/api"

const httpOptions = {
  headers: new HttpHeaders({ 
  'Content-Type': 'application/json; charset=UTF-8',
  'Access-Control-Allow-Headers': 'origin, content-type, accept, authorization',
  'Access-Control-Allow-Methods': 'POST, GET, PUT',
  'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

    login(auth: AuthDTO): Observable<AuthToken> {
      return this.http
        /* .post<AuthToken>(`${URL_API}userAuth.php`, auth) */
        .post<AuthToken>(`${URL_API_SRV}/login-users`, auth, httpOptions)
        .pipe(catchError(this.sharedService.handleError))
    } 

    loginp(auth: AuthDTO): Promise<AuthToken> {
        return this.http.post<AuthToken>( `${URL_API}userAuth.php`, auth, httpOptions ).toPromise();
    }

    logout(): Observable<any> {
      return this.http.post( URL_API + 'signout', { }, httpOptions );
    }

    private setSession(authResult:any) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }

    public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
      return !this.isLoggedIn();
    }

    getExpiration() {
      const expiration: string | null = localStorage.getItem("expires_at");
      const expiresAt: string | null  = "" /* JSON.parse(expiration) */;
      return moment(expiresAt);
  }    

}
