import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { catchError, map, Observable } from 'rxjs';
import { QuestionDTO } from '../Models/new-question.dto';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private urlApi: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.urlApi = "https://tramits.idi.es/public/index.php"
  }

  /* CRUD */

  // GET ALL
  getAllQuestions(): Observable<QuestionDTO[]> {
    return this.http.get<QuestionDTO[]>(`${this.urlApi}/api/questions`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // GET BY ID
  getOneQuestion(id: number): Observable<QuestionDTO> {
    return this.http.get<QuestionDTO>(`${this.urlApi}/api/questions/${id}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  // CREATE
  createQuestion(question: QuestionDTO): Observable<QuestionDTO> {
    return this.http.post<QuestionDTO>(`${this.urlApi}/api/questions`, question)
      .pipe(catchError(this.sharedService.handleError));
  }

  // UPDATE
  updateQuestion(id: number, question: QuestionDTO): Observable<QuestionDTO> {
    return this.http.put<QuestionDTO>(`${this.urlApi}/api/questions/${id}`, question)
      .pipe(catchError(this.sharedService.handleError))
  }

  // DELETE
  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/api/questions/${id}`)
      .pipe(catchError(this.sharedService.handleError))
  }

  // GET BY VECTOR (No endpoint)
  getAllQuestionsByVector(vector_id: number): Observable<QuestionDTO[]> {
    return this.http.get<QuestionDTO[]>(`${this.urlApi}/api/questions`)
      .pipe(
        map((questions: QuestionDTO[]) => questions.filter(q => q.vector_id === vector_id)),
        catchError(this.sharedService.handleError)
      )
  }
}
