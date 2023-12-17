import { Component } from '@angular/core'
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'

import { vectorStateDetail } from 'src/app/Models/question.dto'

@Component({
  selector: 'app-global-regulation-questionnaire-list',
  templateUrl: './global-regulation-questionnaire-list.component.html',
  styleUrls: ['./global-regulation-questionnaire-list.component.scss']
})
export class GlobalRegulationQuestionnaireListComponent {
  private userId: string | null
  userQuestionnaires!: AnswerDTO[]
  questionnaireTemp: vectorStateDetail[] = []


  constructor (
    private enviromentalAuditService: EnvironmentalAuditsService,
    private jwtHelper: JwtHelperService,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;
  }

  ngOnInit() {
    this.loadUserQuestionnaires( this.userId )
  }

  loadUserQuestionnaires( userId: string){
    this.enviromentalAuditService.getGlobalAnswersByCompany( userId )
      .subscribe( (questionaires: AnswerDTO[]) => {
        let isCompleted: boolean = false
        this.userQuestionnaires = questionaires
        this.userQuestionnaires.map(( questionnaire:any ) => {
          questionnaire.completed = JSON.parse(questionnaire.completed)
          questionnaire.completed.map( (vectorStateDetail:any) => {
            if (vectorStateDetail.totalAnswers === 100)
              {
                isCompleted = true
              }
              else {
                isCompleted = false
              }
            console.log("porcentajes: ", questionnaire.questionaireId, vectorStateDetail.vectorId, vectorStateDetail.totalAnswers, isCompleted)
          })
        })

        })
        
  }

  deleteUserQuestionnaire(questionaireId: number) {
    this.enviromentalAuditService.deleteGlobalAnswer(questionaireId).subscribe(() => {
      this.loadUserQuestionnaires( this.userId )
    });
  }
}
