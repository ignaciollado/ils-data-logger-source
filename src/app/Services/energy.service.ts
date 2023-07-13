import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { EnergyDTO } from '../Models/energy.dto';
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

export class EnergyService {
  private urlApi: string;
  private urlAPiMySql:  string;

  constructor(private http: HttpClient) {
    this.urlApi = '../../assets/mocks/fuels.json';
    this.urlAPiMySql = '../../assets/phpAPI/'}

  getAllEnergies(): Observable<EnergyDTO[]> {
    return this.http
      .get<EnergyDTO[]>(`${this.urlAPiMySql}energyGetAll.php`)
  }

  getEnergyById(energyId: number): Observable<EnergyDTO> {
    return this.http
      .get<EnergyDTO>(`${this.urlAPiMySql}energyGetById.php?energyId=${energyId}`)
  }

  createEnergy(energy: EnergyDTO): Observable<EnergyDTO> {
    return this.http
      .post<EnergyDTO>(`${this.urlAPiMySql}energyCreate.php`, energy );
  }

  updateEnergy(energyId: number, Energy: EnergyDTO): Observable<EnergyDTO> {
    return this.http
      .put<EnergyDTO>(this.urlAPiMySql + '/' + energyId, Energy)
      ;
  }

  deleteEnergy(msgId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlAPiMySql + '/' + msgId)
      ;
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
