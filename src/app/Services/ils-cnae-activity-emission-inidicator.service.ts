import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelo de ejemplo, ajusta los campos según tu entidad real
export interface ActivityEmissionIndicator {
  id?: number;
  cnaeCode: string;
  activityName: string;
  emissions: number;
  indicator: string;
}

@Injectable({
  providedIn: 'root'
})
export class IlsCnaeActivityEmissionIndicatorService {

  private apiUrl = 'https://tramits.idi.es/public/index.php/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Obtener todos los registros
  getAll(): Observable<ActivityEmissionIndicator[]> {
    return this.http.get<ActivityEmissionIndicator[]>(`${this.apiUrl}/ils-cnae-activity-emission-indicator`);
  }

  // Obtener un registro por ID
  getById(id: number): Observable<ActivityEmissionIndicator> {
    return this.http.get<ActivityEmissionIndicator>(`${this.apiUrl}/ils-cnae-activity-emission-indicator/${id}`);
  }

  // Crear un nuevo registro
  create(data: ActivityEmissionIndicator): Observable<ActivityEmissionIndicator> {
    return this.http.post<ActivityEmissionIndicator>(`${this.apiUrl}/ils-cnae-activity-emission-indicator`, data, this.httpOptions);
  }

  // Actualizar un registro
  update(id: number, data: ActivityEmissionIndicator): Observable<ActivityEmissionIndicator> {
    return this.http.put<ActivityEmissionIndicator>(`${this.apiUrl}/ils-cnae-activity-emission-indicator/${id}`, data, this.httpOptions);
  }

  // Eliminar un registro
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ils-cnae-activity-emission-indicator/${id}`, this.httpOptions);
  }

  // Opciones (para CORS o metadata si lo usas en tu backend)
  options(): Observable<any> {
    return this.http.options(this.apiUrl, this.httpOptions);
  }
}
