import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL_API = 'https://emailvalidation.abstractapi.com/v1/?api_key=0b27a379af684fa9bd8c0a672c535d3d'
const URL_API_SEND = "https://api.emailjs.com/api/v1.0/email/send"
export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})

export class EmailManagementService {

  constructor(private http: HttpClient) {}


  validateThisEmail(emailAddress: string): Observable<any> {
    return this.http
      .get<any>(`${URL_API}&email=${emailAddress}` )
  }

  sendCustomerEmail( emailAddress: string, userName: string): Observable<any> {
    return this.http
      .get<any>(`${URL_API_SEND}`)
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was:', error.message);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

}
