import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { catchError, map, Observable } from 'rxjs';
import { QuestionDTO } from '../Models/new-question.dto';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private urlApi: string = 'https://tramits.idi.es/public/index.php/api/questions';

  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  /* CRUD */

  // GET ALL
  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlApi}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY ID
  getOneQuestion(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // CREATE
  createQuestion(question: QuestionDTO): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, question)
      .pipe(catchError(this.sharedService.handleError));
  }

  // UPDATE
  updateQuestion(id: number, question: QuestionDTO): Observable<any> {
    return this.http.put<any>(`${this.urlApi}/${id}`, question)
      .pipe(catchError(this.sharedService.handleError))
  }

  // DELETE
  deleteQuestion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApi}/${id}`)
      .pipe(catchError(this.sharedService.handleError))
  }

  // GET BY VECTOR (No endpoint)
  getAllQuestionsByVector(vector_id: number): Observable<QuestionDTO[]> {
    return this.http.get<QuestionDTO[]>(`${this.urlApi}`)
      .pipe(
        map((questions: QuestionDTO[]) => questions.filter(q => q.vector_id === vector_id)),
        catchError(this.sharedService.handleError)
      )
  }
}
