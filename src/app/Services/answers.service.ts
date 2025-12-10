import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { catchError, map, Observable } from 'rxjs';
import { AnswerDTO } from '../Models/new-answer.dto';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  private urlApi: string = 'https://tramits.idi.es/public/index.php/api/answers';

  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  /* CRUD */

  // GET ALL
  getAllAnswers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApi}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY ID
  getOneAnswer(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // CREATE
  createAnswer(answer: AnswerDTO): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, answer)
      .pipe(catchError(this.sharedService.handleError));
  }

  // UPDATE
  updateAnswer(id: number, answer: AnswerDTO): Observable<any> {
    return this.http.put<any>(`${this.urlApi}/${id}`, answer)
      .pipe(catchError(this.sharedService.handleError));
  }

  // DELETE
  deleteAnswer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApi}/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY QUESTION (No endpoint)
  getAllAnswersByQuestion(question_id: number): Observable<AnswerDTO[]> {
    return this.http.get<AnswerDTO[]>(`${this.urlApi}`)
      .pipe(
        map((answers: AnswerDTO[]) => answers.filter(a => a.question_id === question_id)),
        catchError(this.sharedService.handleError)
      )
  }
}
