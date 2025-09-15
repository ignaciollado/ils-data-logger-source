import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EnergyDTO } from '../Models/energy.dto';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from './shared.service';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"

const httpsOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain'
  })
};

export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})

export class EnergyService {
  private urlApi: string;
  private urlAPiMySql:  string;
  private apiUrl = 'https://tramits.idi.es/public/index.php/api';

  constructor(private http: HttpClient,
    private sharedService: SharedService) {
    this.urlApi = '../../assets/mocks/fuels.json';
    this.urlAPiMySql = '../../assets/phpAPI/'}

  /*   getAllEnergies(): Observable<EnergyDTO[]> {
    return this.http.get<EnergyDTO[]>(`${URL_API}energyGetAll.php`) 
  } */

  getAllEnergies(): Observable<EnergyDTO[]> {
    return this.http.get<EnergyDTO[]>(`${this.apiUrl}/ils_energy`) 
  }     

  /*   getEnergyById(energyId: number): Observable<EnergyDTO> {
    return this.http
      .get<EnergyDTO>(`${URL_API}energyGetById.php?energyId=${energyId}`)
  } */

  getEnergyById(energyId: number): Observable<EnergyDTO> {
    return this.http
      .get<EnergyDTO>(`${this.apiUrl}/ils_energy/${energyId}`)
  }

  createEnergy(energy: EnergyDTO): Observable<EnergyDTO> {
    return this.http
      .post<EnergyDTO>(`${URL_API}energyCreate.php`, energy );
  }

  updateEnergy(energyId: number, Energy: EnergyDTO): Observable<EnergyDTO> {
    return this.http
      .put<EnergyDTO>(URL_API + '/' + energyId, Energy)
      ;
  }

  deleteEnergy(energyId: number): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}energyDelete.php?energyId=${energyId}`)
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
