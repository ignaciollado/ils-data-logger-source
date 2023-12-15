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
    this.loadQuestionnaireResult( +questionnaireID )
  }

  loadQuestionnaireResult( questionnaireID: number){
        this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
          .subscribe( (questionnaires: AnswerDTO[]) =>{
            this.userQuestionnaires = questionnaires
            console.log(this.userQuestionnaires)
            this.userQuestionnaires.map((item:AnswerDTO) =>{
              JSON.parse(item.userAnswers).map((vectorAnswers:any) => {
                vectorAnswers.regulations.map((item:any) =>{
                    item.regulation.map((questions:any) =>{
                      if (questions.q1) {
                        questions.q1.map((q1Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                               if (regulation.reg_ID == q1Reg) {
                                questions.q1 = questions.q1+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><span><a href='${regulation.link}'>`+regulation.link+"</a></span></span><br>"
                              }
                          }
                          )
                        })
                      }
                      if (questions.q2) {
                        questions.q2.map((q2Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q2Reg) {
                              questions.q2 = questions.q2+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q3) {
                        questions.q3.map((q3Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q3Reg) {
                              questions.q3 = questions.q3+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q4) {
                        questions.q4.map((q4Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q4Reg) {
                              questions.q4 = questions.q4+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q5) {
                        questions.q5.map((q5Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q5Reg) {
                              questions.q5 = questions.q5+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q6) {
                        questions.q6.map((q6Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q6Reg) {
                              questions.q6 = questions.q6+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q7) {
                        questions.q7.map((q7Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q7Reg) {
                              questions.q7 = questions.q7+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q8) {
                        questions.q8.map((q8Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q8Reg) {
                              questions.q8 = questions.q8+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q9) {  
                        questions.q9.map((q9Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q9Reg) {
                              questions.q9 = questions.q9+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q10) {
                        questions.q10.map((q10Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q10Reg) {
                              questions.q10 = questions.q10+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
                        }
                        )
                        })
                      }
                      if (questions.q11) {
                        questions.q11.map((q11Reg:any) =>{
                          this.regulationsList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q11Reg) {
                              questions.q11 = questions.q11+"<span>"+regulation.Ambito+"</span><span>"+regulation.Titulo+`</span><span><a href='${regulation.link}'>`+regulation.link+"</a></span><br>"
                            }
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
