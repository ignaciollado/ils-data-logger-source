import { Component } from '@angular/core'
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'


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
        this.enviromentalAuditService.getGlobalAnswersByCompany( userId )
          .subscribe( (questionaires: AnswerDTO[]) => {
            this.userQuestionaires = questionaires
            })
  }

}
