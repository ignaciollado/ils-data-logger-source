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
/* const URL_API_SRV = "http://localhost:8080/public/index.php" */


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain' /* la única forma de evitar errores de CORS ha sido añadiendo esta cabecera */
  })
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

    login(auth: AuthDTO): Observable<AuthToken> {
      return this.http
        /* .post<AuthToken>(`${URL_API}userAuth.php`, auth) */
        .post<AuthToken>( `${URL_API_SRV}/api/login-users/`, auth, httpOptions )
        .pipe(catchError(this.sharedService.handleError))
    }

    loginp(auth: AuthDTO): Promise<AuthToken> {
        return this.http.post<AuthToken>( `${URL_API}userAuth.php`, auth ).toPromise();
    }

    logout(): Observable<any> {
      return this.http.post( URL_API + 'signout', { } );
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
