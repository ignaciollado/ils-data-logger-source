
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthDTO } from '../Models/auth.dto';
import { SharedService } from './shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  })
};

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(
    private http: HttpClient, 
    private sharedService: SharedService,
    private jwtHelper: JwtHelperService ) { }

    login(auth: AuthDTO): Observable<AuthToken> {
      return this.http
        .post<AuthToken>( `${URL_API_SRV}/api/login-users/`, auth, httpOptions )
        /* .pipe(
            catchError(this.sharedService.handleError),
          )  */
    }

    logout(): Observable<any> {
      return this.http.post( URL_API + 'signout', { } );
    }
    
}
