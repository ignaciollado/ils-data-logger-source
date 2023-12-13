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
            console.log (this.userQuestionnaires)
            this.userQuestionnaires.map( (item:AnswerDTO) => {
             /*  item.userAnswers = item.userAnswers.replaceAll("#","[")
              item.userAnswers = item.userAnswers.replaceAll("[","]")
              item.userAnswers = item.userAnswers.replaceAll("-input","")
              item.userAnswers = item.userAnswers.replaceAll("true<br>","") */
              console.log ("***",item.userAnswers,"***",JSON.parse(item.userAnswers), "***")
              /* item.userAnswers = item.userAnswers.replaceAll("-input","") */
/*               item.userAnswers = item.userAnswers.replaceAll("#true<br>","],")
              item.userAnswers = item.userAnswers.replaceAll("#","[") */
/*               item.userAnswers = item.userAnswers.replaceAll(",,","##")
              item.userAnswers = item.userAnswers.replaceAll(", ","//") */
             /*  console.log ( ">>>",item.userAnswers, "<<<") */
       /*        console.log("***", JSON.stringify(item.userAnswers) , "***")     */      
            })
          })
  }
}
