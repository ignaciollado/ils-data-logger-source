import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AspectDTO } from '../Models/aspect.dto';
import { Observable } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';

const httpsOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: 'json_token'
  })
}

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})

export class AspectService {
  private urlAPiMySql:  string;

  constructor(private http: HttpClient) {
    this.urlAPiMySql = '../../assets/phpAPI/'}

  getAllAspects(): Observable<AspectDTO[]> {
    return this.http
      .get<AspectDTO[]>(`${this.urlAPiMySql}aspectGetAll.php`)
  }


  getAspectById(aspectId: string): Observable<AspectDTO> {
    return this.http
      .get<AspectDTO>(`${this.urlAPiMySql}aspectGetById.php?aspectId=${aspectId}` )
  }

  createAspect(aspect: AspectDTO): Observable<AspectDTO> {
    return this.http
      .post<AspectDTO>(`${this.urlAPiMySql}aspectCreate.php`, aspect );
  }

  updateAspect(aspectId: string, aspect: AspectDTO): Observable<AspectDTO> {
    return this.http
      .put<AspectDTO>(`${this.urlAPiMySql}aspectUpdate.php?aspectId=${aspectId}`, aspect);
  }

  deleteAspect(aspectId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${this.urlAPiMySql}aspectDelete.php?aspectId=${aspectId}`);
  }

  errorLog(error: HttpErrorResponse): void {
    console.error('An error occurred:', error.error.msg);
    console.error('Backend returned code:', error.status);
    console.error('Complete message was::', error.message);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

}
