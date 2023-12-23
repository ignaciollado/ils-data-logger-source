import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AspectDTO } from '../Models/aspect.dto';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from './shared.service';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const URL_MOCKS = '../../assets/mocks/consumptions.json'

const httpsOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: 'json_token'
  })
}

export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})

export class AspectService {

  constructor(private http: HttpClient,
    private sharedService: SharedService) {}

  getAllAspects(): Observable<AspectDTO[]> {
    return this.http
      .get<AspectDTO[]>(`${URL_API}aspectGetAll.php`)
  }

  getAspectById(aspectId: string): Observable<AspectDTO> {
    return this.http
      .get<AspectDTO>(`${URL_API}aspectGetById.php?aspectId=${aspectId}` )
  }

  createAspect(aspect: AspectDTO): Observable<AspectDTO> {
    return this.http
      .post<AspectDTO>(`${URL_API}aspectCreate.php`, aspect );
  }

  updateAspect(aspectId: string, aspect: AspectDTO): Observable<AspectDTO> {
    return this.http
      .put<AspectDTO>(`${URL_API}aspectUpdate.php?aspectId=${aspectId}`, aspect);
  }

  deleteAspect(aspectId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}aspectDelete.php?aspectId=${aspectId}`)
      .pipe(catchError(this.sharedService.handleError));
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
