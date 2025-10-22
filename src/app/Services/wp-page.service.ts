import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WpPage } from '../Models/wp-page-data.dto';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class WPpageService {
  private pageUrl = 'https://app.adrbalears.es/wp-json/wp/v2/pages';

  headers = new HttpHeaders()
  .set( 'Content-Type', 'application/vnd.api+json' ) 

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<WpPage[]> {
    return this.httpClient.get<WpPage[]>(this.pageUrl, { headers: this.headers })
  }

  get(id: string|null): Observable<WpPage> {
    return this.httpClient.get<WpPage>(`${this.pageUrl}/${id}`, { headers: this.headers })
  }

  create(data: WpPage): Observable<any> {
    return this.httpClient.post(this.pageUrl, data, { headers: this.headers })
  }

  update(id: string, data: WpPage): Observable<any> {
    return this.httpClient.put(`${this.pageUrl}/${id}`, data, { headers: this.headers })
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${this.pageUrl}/${id}`, { headers: this.headers })
  }

  deleteAll(): Observable<any> {
    return this.httpClient.delete(this.pageUrl, { headers: this.headers })
  }

  findByTitle(title: string): Observable<WpPage[]> {
    return this.httpClient.get<WpPage[]>(`${this.pageUrl}?title=${title}`, { headers: this.headers })
  }

  getLegalContent(id: number|null): Observable<WpPage> {
    return this.httpClient.get<WpPage>(`${this.pageUrl}/${id}`)
  }

}
