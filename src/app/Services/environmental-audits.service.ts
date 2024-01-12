import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionDTO, vectorStateDetail } from '../Models/question.dto';
import { AnswerDTO } from '../Models/answer.dto';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

const URL_MOCKS = '../../assets/mocks/questionsList.json'
const URL_MOCKS_INTRO_TEXT = '../../assets/mocks/introTextQuestionnaire.json'

const URL_API = '../../assets/phpAPI/'

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalAuditsService {
  private urlAPiMock: string;
  private urlAPiMockIntroText: string;

  constructor( private http: HttpClient, private sharedService: SharedService ) {
    this.urlAPiMock = '../../assets/mocks/'
  }

  getIntroText(): Observable<string> {
    return this.http
      .get<string>(`${this.urlAPiMock}introTextQuestionnaire.json`)
      .pipe(catchError(this.sharedService.handleError))
  }

  getQuestionList(): Observable<QuestionDTO[]> {
    return this.http
      .get<QuestionDTO[]>(`${this.urlAPiMock}questionsList.json`)
      .pipe(catchError(this.sharedService.handleError))
  }

  getAutoevaluationQuestionList(): Observable<QuestionDTO[]> {
    return this.http
      .get<QuestionDTO[]>(`${this.urlAPiMock}questionsListAutoEvaluation.json`)
      .pipe(catchError(this.sharedService.handleError))
  }

  createGlobalAnswer(resultsQuestionnaire: string[], companyId: string, delegation: number, completed: vectorStateDetail[]): Observable<string[]> {
    return this.http
      .post<string[]>(`${URL_API}questionnaireAnswerCreate.php?companyId=${companyId}&delegation=${delegation}&completed=${JSON.stringify(completed)}`, resultsQuestionnaire)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateGlobalAnswer(resultsQuestionnaire: string[], questionnaireID: number, delegation: number, completed: vectorStateDetail[]): Observable<QuestionDTO> {
    return this.http
      .put<QuestionDTO>(`${URL_API}questionnaireAnswerUpdate.php?questionnaireID=${questionnaireID}&delegation=${delegation}&completed=${JSON.stringify(completed)}`, resultsQuestionnaire)
  }

  deleteGlobalAnswer(questionnaireId: number) : Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}questionnaireAnswerDelete.php?questionnaireId=${questionnaireId}`)
      .pipe(catchError(this.sharedService.handleError));
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
      .get<AnswerDTO[]>(`${this.urlAPiMock}questionnaireCompleted.json`)
      .pipe(catchError(this.sharedService.handleError))

  }

  getRegulations(): Observable<AnswerDTO[]> {
    return this.http
    .get<AnswerDTO[]>(`${URL_API}regulationsGetAll.php`)
 }
 getRegulationByID(regID: string): Observable<AnswerDTO[]> {
  return this.http
  .get<AnswerDTO[]>(`${URL_API}regulationGetByID.php?regID=${regID}`)
}
}
