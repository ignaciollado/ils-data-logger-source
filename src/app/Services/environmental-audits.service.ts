import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionDTO } from '../Models/question.dto';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

const URL_MOCKS = '../../assets/mocks/questionsList.json'
const URL_API = '../../assets/phpAPI/'
@Injectable({
  providedIn: 'root'
})
export class EnvironmentalAuditsService {
  private urlAPiMock:  string;

  constructor( private http: HttpClient, private sharedService: SharedService ) {
    this.urlAPiMock = '../../assets/mocks/'
  }

  getQuestionList(): Observable<QuestionDTO[]> {
    return this.http
      .get<QuestionDTO[]>(`${this.urlAPiMock}questionsList.json`)
      .pipe(catchError(this.sharedService.handleError))
  }

  createGlobalAnswer(answer:string, questionNumber:string, regulation: string): Observable<QuestionDTO> {
    console.log(answer, questionNumber, regulation)
    return this.http
      .post<QuestionDTO>(`${URL_API}globalAnswerCreate.php`, {answer, questionNumber, regulation})
      .pipe(catchError(this.sharedService.handleError));
  }

  updateGlobalAnswer(answerId: string, answer: string): Observable<QuestionDTO> {
    return this.http
      .put<QuestionDTO>(`${URL_API}globalAnswerUpdate.php?consumptionId=${answerId}`, answer)
  }
}
