import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { MonthDTO } from '../Models/month.dto';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  private urlAPiMySql:  string;
  constructor(private http: HttpClient,
    private sharedService: SharedService) { 
      this.urlAPiMySql = '../../assets/phpAPI/'
    }

  getAllMonths (): Observable<MonthDTO[]> {
    return this.http
      .get<MonthDTO[]>(`${this.urlAPiMySql}monthGetAll.php`)
  }
}
