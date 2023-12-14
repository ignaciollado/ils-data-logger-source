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
        console.log (this.regulationsList)
        this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
          .subscribe( (questionnaires: AnswerDTO[]) => {
            this.userQuestionnaires = questionnaires
            this.userQuestionnaires.map( (item:AnswerDTO) => {
              JSON.parse(item.userAnswers).map((vectorAnswers:any) => {
                vectorAnswers.regulations.map((item:any) =>{
                    item.regulation.map( (questions:any) =>{
                      if (questions.q1) {
                        questions.q1.map((q1Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q1Reg, ((regulation.reg_ID === q1Reg)))
                             /*  if (regulation.reg_ID == q1Reg) {
                                q1Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                                console.log( regulation.reg_ID, q1Reg)
                              } */
                          }
                          )
                        })
                      }
                      if (questions.q2) {
                        questions.q2.map((q2Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q2Reg, ((regulation.reg_ID === q2Reg)))
                           /*  if (regulation.reg_ID === q2Reg) {
                              q2Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q2Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q3) {
                        questions.q3.map((q3Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q3Reg, ((regulation.reg_ID === q3Reg)))
                            /* if (regulation.reg_ID === q3Reg) {
                              q3Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q3Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q4) {
                        questions.q4.map((q4Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q4Reg, ((regulation.reg_ID === q4Reg)))
                           /*  if (regulation.reg_ID === q4Reg) {
                              q4Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q4Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q5) {
                        questions.q5.map((q5Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q5Reg, ((regulation.reg_ID === q5Reg)))
                          /*   if (regulation.reg_ID === q5Reg) {
                              q5Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q5Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q6) {
                        questions.q6.map((q6Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q6Reg, ((regulation.reg_ID === q6Reg)))
                           /*  if (regulation.reg_ID === q6Reg) {
                              q6Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q6Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q7) {
                        questions.q7.map((q7Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q7Reg, ((regulation.reg_ID === q7Reg)))
                          /*   if (regulation.reg_ID === q7Reg) {
                              q7Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q7Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q8) {
                        questions.q8.map((q8Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q8Reg, ((regulation.reg_ID === q8Reg)))
                           /*  if (regulation.reg_ID === q8Reg) {
                              q8Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q8Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q9) {  
                        questions.q9.map((q9Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q9Reg, ((regulation.reg_ID === q9Reg)))
                        /*     if (regulation.reg_ID === q9Reg) {
                              q9Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q9Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q10) {
                        questions.q10.map((q10Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q10Reg, ((regulation.reg_ID === q10Reg)))
                          /*   if (regulation.reg_ID === q10Reg) {
                              q10Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q10Reg)
                            } */
                        }
                        )
                        })
                      }
                      if (questions.q11) {
                        questions.q11.map((q11Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                            console.log (regulation.reg_ID, q11Reg, ((regulation.reg_ID === q11Reg)))
                          /*   if (regulation.reg_ID === q11Reg) {
                              q11Reg = regulation.reg_ID+"/"+regulation.Ambito+"/"+regulation.Titulo+"/"+regulation.link
                              console.log( regulation.reg_ID, q11Reg)
                            } */
                        }
                        )
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
      })
}
}
