import { Component } from '@angular/core'
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'
import { Answer } from 'src/app/Models/question.dto'

@Component({
  selector: 'app-global-regulation-questionnaire-list',
  templateUrl: './global-regulation-questionnaire-list.component.html',
  styleUrls: ['./global-regulation-questionnaire-list.component.scss']
})
export class GlobalRegulationQuestionnaireListComponent {
  private userId: string | null
  userQuestionaires!: AnswerDTO[]

  constructor (
    private enviromentalAuditService: EnvironmentalAuditsService,
    private jwtHelper: JwtHelperService,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;
  }

  ngOnInit() {
    this.loadAnswers( this.userId )
  }

  loadAnswers( userId: string){
/*       this.enviromentalAuditService.getAllAnswersByCompany(userId)
        .subscribe( (answers:AnswerDTO[]) => {
          this.answers = answers
          answers.map((item:any) => {
            console.log(item.id, item.companyId)
            item.answers.map((answersItem:any) =>{
              console.log(answersItem.vectorId, answersItem.vectorName)
              answersItem.questions.map((questionItem:any)=>{
                console.log(questionItem.questionTextES)
              })
            })
          })
        }
        ) */

        this.enviromentalAuditService.getMockAnswers( this.userId )
          .subscribe( (userQuestionaires: AnswerDTO[]) => {
            this.userQuestionaires = userQuestionaires
            this.userQuestionaires.map( (userAnswers:any) => {
               
              console.log (userAnswers.questionaire)
              userAnswers.questionaire.map( (item:any) => {
                  console.log (item)
                })

            }) 
          })
  }

}
