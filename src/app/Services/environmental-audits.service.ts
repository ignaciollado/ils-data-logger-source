import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionDTO } from '../Models/question.dto';
import { AnswerDTO } from '../Models/answer.dto';
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

  createGlobalAnswer(resultsQuestionnaire: string[], companyId: string, completed: boolean): Observable<string[]> {
    console.log (resultsQuestionnaire, companyId)
    return this.http
      .post<string[]>(`${URL_API}questionnaireAnswerCreate.php?companyId=${companyId}&completed=${completed}`, resultsQuestionnaire)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateGlobalAnswer(answerId: string, answer: string, regulation: string[]): Observable<QuestionDTO> {
    return this.http
      .put<QuestionDTO>(`${URL_API}globalAnswerUpdate.php?consumptionId=${answerId}`, answer)
  }

  getGlobalAnswersByCompany(companyId:any): Observable<AnswerDTO[]> {
    return this.http
     .get<AnswerDTO[]>(`${URL_API}questionnaireAnswersGetByCompanyId.php?companyId=${companyId}`)
  }

  getQuestionnaireByID(questionnaireID: number): Observable<AnswerDTO[]> {
    return this.http
     .get<AnswerDTO[]>(`${URL_API}questionnaireByID.php?questionnaireID=${questionnaireID}`)
  }

  getMockAnswers(userId: string): Observable<AnswerDTO[]> {
    return this.http
      .get<AnswerDTO[]>(`${this.urlAPiMock}answersList.json`)
      .pipe(catchError(this.sharedService.handleError))

  }
}
