import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'
import { ActivatedRoute, Router } from '@angular/router';
import { answeredQuestionnaire } from 'src/app/Models/answeredQuestionnaire.dto';
import { regulationsDTO } from 'src/app/Models/regulation.dto';

@Component({
  selector: 'app-global-regulation-questionnaire-answer',
  templateUrl: './global-regulation-questionnaire-answer.component.html',
  styleUrls: ['./global-regulation-questionnaire-answer.component.scss']
})
export class GlobalRegulationQuestionnaireAnswerComponent {
  private userId: string | null
  userQuestionnaires: AnswerDTO[] = []
  userQuestionnaireTemp: answeredQuestionnaire[] = []
  regulationsList: regulationsDTO[] = []

  constructor (
    private enviromentalAuditService: EnvironmentalAuditsService,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils
  }

  ngOnInit() {
    const questionnaireID = this.route.snapshot.paramMap.get('id');
    this.loadRegulations()
    this.loadQuestionnaire( +questionnaireID )
  }

  loadQuestionnaire( questionnaireID: number){
        this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
          .subscribe( (questionnaires: AnswerDTO[]) => {
            this.userQuestionnaires = questionnaires
            this.userQuestionnaires.map( (item:AnswerDTO) => {
              JSON.parse(item.userAnswers).map((vectorAnswers:any) => {
                vectorAnswers.regulations.map((item:any) =>{
                    item.regulation.map( (questions:any) =>{
                      if (questions.q1) {
                        questions.q1.map((q1Reg:any) =>{
                          console.log("q1",q1Reg)
                          this.regulationsList.map((regulation:any) => {
                              if (regulation.reg_ID === q1Reg) {
                                q1Reg += regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                                console.log( regulation.reg_ID, q1Reg)
                              }
                          }
                          )
                        })
                      }
                      if (questions.q2) {
                        questions.q2.map((q2Reg:any) =>{
                         //console.log("q2",q2Reg, this.loadRegulationsByID(q2Reg))
                        })
                      }
                      if (questions.q3) {
                        questions.q3.map((q3Reg:any) =>{
                         //console.log("q3",q3Reg, this.loadRegulationsByID(q3Reg))
                        })
                      }
                      if (questions.q4) {
                        questions.q4.map((q4Reg:any) =>{
                         //console.log("q4",q4Reg, this.loadRegulationsByID(q4Reg))
                        })
                      }
                      if (questions.q5) {
                        questions.q5.map((q5Reg:any) =>{
                         //console.log("q5",q5Reg, this.loadRegulationsByID(q5Reg))
                        })
                      }
                      if (questions.q6) {
                        questions.q6.map((q6Reg:any) =>{
                         //console.log("q6",q6Reg, this.loadRegulationsByID(q6Reg))
                        })
                      }
                      if (questions.q7) {
                        questions.q7.map((q7Reg:any) =>{
                         //console.log("q7",q7Reg, this.loadRegulationsByID(q7Reg))
                        })
                      }
                      if (questions.q8) {
                        questions.q8.map((q8Reg:any) =>{
                         //console.log("q8",q8Reg, this.loadRegulationsByID(q8Reg))
                        })
                      }
                      if (questions.q9) {  
                        questions.q9.map((q9Reg:any) =>{
                         //console.log("q9",q9Reg, this.loadRegulationsByID(q9Reg))
                        })
                      }
                      if (questions.q10) {
                        questions.q10.map((q10Reg:any) =>{
                         //console.log("q10",q10Reg, this.loadRegulationsByID(q10Reg))
                        })
                      }
                      if (questions.q11) {
                        questions.q11.map((q11Reg:any) =>{
                         //console.log("q11",q11Reg, this.loadRegulationsByID(q11Reg))
                        })
                      }  
                    })
                  })

                this.userQuestionnaireTemp.push(vectorAnswers)
                
                
              })
            })
          })
  }

  loadRegulations(){
    this.enviromentalAuditService.getRegulations()
      .subscribe( (regulations: any[]) => {
        this.regulationsList = regulations
        console.log (this.regulationsList)
      })
}
}
