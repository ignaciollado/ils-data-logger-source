import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-global-regulation-questionnaire-answer',
  templateUrl: './global-regulation-questionnaire-answer.component.html',
  styleUrls: ['./global-regulation-questionnaire-answer.component.scss']
})
export class GlobalRegulationQuestionnaireAnswerComponent {
  private userId: string | null
  userQuestionnaires: AnswerDTO[] = []
  userQuestionnairebyID: AnswerDTO[] = []


  constructor (
    private enviromentalAuditService: EnvironmentalAuditsService,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;
  }

  ngOnInit() {
    const questionnaireID = this.route.snapshot.paramMap.get('id');
    this.loadQuestionnaire( +questionnaireID )
  }

  loadQuestionnaire( questionnaireID: number){
        this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
          .subscribe( (questionnaires: AnswerDTO[]) => {
            this.userQuestionnaires = questionnaires

            this.userQuestionnaires.map( (item:AnswerDTO) => {
              item.userAnswers.replace("false","<span class='false'>false</span>")
              item.userAnswers.replace("true","<span class='true'>true</span>")
            })

           /*  this.userQuestionnairebyID = this.userQuestionnaire.filter((item:AnswerDTO)=>{ item.id === questionnaireID })
            console.log (this.userQuestionnairebyID)

            const userQuestionnaires = questionnaires // = ['spray', 'elite', 'exuberant', 'destruction', 'present'];

            this.userQuestionnairebyID = userQuestionnaires.filter((word) => (word.id >= questionnaireID && word.id <= questionnaireID));

            console.log(this.userQuestionnairebyID); */


            })
  }
}
