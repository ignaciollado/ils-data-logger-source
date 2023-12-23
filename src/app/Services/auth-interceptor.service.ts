import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class AuthInterceptorService implements HttpInterceptor {

  access_token: string | null;

  constructor() {
    this.access_token = sessionStorage.getItem('access_token');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

   /*  req = req.clone({ withCredentials: true}) */ /* se usa para adjuntar la cookie con las credenciales a las llamadas a la API */

    if (this.access_token) {
      req = req.clone({
        setHeaders: {
         'Content-Type': 'application/json; charset=utf-8',
         Accept: 'application/json',
         Authorization: `Bearer ${this.access_token}`, /* Se añade el JWT en todas las peticiones */
        },
      });
    }

    return next.handle(req); /* Devuelve la petición al servidor */
  }

}
