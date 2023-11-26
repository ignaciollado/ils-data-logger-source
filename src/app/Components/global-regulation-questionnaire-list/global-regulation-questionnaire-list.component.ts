import { Component } from '@angular/core'
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { QuestionDTO } from 'src/app/Models/question.dto'
import { JwtHelperService } from '@auth0/angular-jwt'

@Component({
  selector: 'app-global-regulation-questionnaire-list',
  templateUrl: './global-regulation-questionnaire-list.component.html',
  styleUrls: ['./global-regulation-questionnaire-list.component.scss']
})
export class GlobalRegulationQuestionnaireListComponent {
  private userId: string | null
  answers!: QuestionDTO[]

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

      this.enviromentalAuditService.getAllAnswersByCompany(userId)
        .subscribe( (answers:QuestionDTO[]) => {
          this.answers = answers
          console.log (this.answers)
        }
        )

  }

}
