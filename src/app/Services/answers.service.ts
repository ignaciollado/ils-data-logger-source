import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { catchError, map, Observable } from 'rxjs';
import { AnswerDTO } from '../Models/new-answer.dto';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  private urlApi: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.urlApi = "https://tramits.idi.es/public/index.php";
  }

  /* CRUD */

  // GET ALL
  getAllAnswers(): Observable<AnswerDTO[]> {
    return this.http.get<AnswerDTO[]>(`${this.urlApi}/api/answers`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY ID
  getOneAnswer(id: number): Observable<AnswerDTO> {
    return this.http.get<AnswerDTO>(`${this.urlApi}/api/answers/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // CREATE
  createAnswer(answer: AnswerDTO): Observable<AnswerDTO> {
    return this.http.post<AnswerDTO>(`${this.urlApi}/api/answers`, answer)
      .pipe(catchError(this.sharedService.handleError));
  }

  // UPDATE
  updateAnswer(id: number, answer: AnswerDTO): Observable<AnswerDTO> {
    return this.http.put<AnswerDTO>(`${this.urlApi}/api/answers/${id}`, answer)
      .pipe(catchError(this.sharedService.handleError));
  }

  // DELETE
  deleteAnswer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/api/answers/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY QUESTION (No endpoint)
  getAllAnswersByQuestion(question_id: number): Observable<AnswerDTO[]> {
    return this.http.get<AnswerDTO[]>(`${this.urlApi}/api/answers`)
      .pipe(
        map((answers: AnswerDTO[]) => answers.filter(a => a.question_id === question_id)),
        catchError(this.sharedService.handleError)
      )
  }
}
