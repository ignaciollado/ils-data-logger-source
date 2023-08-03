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
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const access_token: string | null = sessionStorage.getItem("access_token")

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain', /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
    /* 'Authorization': `Bearer ${access_token}` */
  })
};

const requestOptions = { headers: httpOptions };

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

    login(auth: AuthDTO): Observable<AuthToken> {
      return this.http
        .post<AuthToken>( `${URL_API_SRV}/api/login-users/`, auth, httpOptions )
        .pipe(catchError(this.sharedService.handleError))
    }

    /* loginp(auth: AuthDTO): Promise<AuthToken> {
        return this.http.post<AuthToken>( `${URL_API}userAuth.php`, auth ).toPromise();
    } */

    logout(): Observable<any> {
      return this.http.post( URL_API + 'signout', { } );
    }

    private setSession(authResult:any) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }

    public isLoggedIn():any {

     /*  if ( this.getExpiration() === null) {
        console.log ('not logged in')
        return false
      } else {
        const access_token: string | null = sessionStorage.getItem("access_token");
        console.log ('logged in')
        console.log ('getting token data: ' + access_token)
        return this.http.post<string>( `${URL_API_SRV}/api/verify-token`, access_token, httpOptions )
        .pipe(catchError(this.sharedService.handleError))
      } */
      
    }

    isLoggedOut() {
      return !this.isLoggedIn();
    }

    getExpiration(access_token:any):Observable<any> {
  
        console.log ('getting token data:' + access_token)
        return this.http.post<string>( `${URL_API_SRV}/api/verify-token`, access_token, httpOptions )
        .pipe(catchError(this.sharedService.handleError))

    }

}
