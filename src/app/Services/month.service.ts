import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DelegationDTO } from '../Models/delegation.dto';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  private urlAPiMySql:  string;
  constructor(private http: HttpClient,
    private sharedService: SharedService) { 
      this.urlAPiMySql = '../../assets/phpAPI/'
    }

  getAllMonths (companyId: string): Observable<DelegationDTO[]> {
    return this.http
      .get<DelegationDTO[]>(`${this.urlAPiMySql}delegationGetByCompany.php?companyId=${companyId}`)
  }
}
