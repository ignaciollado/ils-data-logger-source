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
  regulationList: regulationsDTO[] = [] /* Listado de toda la regulación medioambiental */
  vector: string[] =["RESIDUOS","SEGURIDAD INDUSTRIAL","AGUAS","ATMÓSFERA","SUSTANCIAS Y PREPARADOS","MEDIOAMBIENTE GENERAL"]

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
            this.userQuestionnaires.map((item:AnswerDTO) =>{
              console.log(JSON.parse(item.userAnswers))
              JSON.parse(item.userAnswers).map((vectorAnswers:any) => {
                vectorAnswers.vectorId = this.vector[vectorAnswers.vectorId-1]
                vectorAnswers.regulations.map((item:any) =>{
                    item.regulation.map((questions:any) =>{
                      if (questions.q1) {
                        let q1Temp: string = ""
                        questions.q1 = [...new Set(questions.q1)]; /* elimino duplicados */
                        questions.q1.map((q1Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                               if (regulation.reg_ID == q1Reg) {
                                q1Temp += "<td> "+regulation.Ambito+" </td><td> "+regulation.Titulo+` </td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                              }
                          }
                          )
                        })
                        questions.q1 = q1Temp
                      }
                      if (questions.q2) {
                        let q2Temp: string = ""
                        questions.q2 = [...new Set(questions.q2)]; /* elimino duplicados */
                        questions.q2.map((q2Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q2Reg) {
                              q2Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q2 = q2Temp
                      }
                      if (questions.q3) {
                        let q3Temp: string = ""
                        questions.q3 = [...new Set(questions.q3)]; /* elimino duplicados */
                        questions.q3.map((q3Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q3Reg) {
                              q3Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q3 = q3Temp
                      }
                      if (questions.q4) {
                        let q4Temp: string = ""
                        questions.q4 = [...new Set(questions.q4)]; /* elimino duplicados */
                        questions.q4.map((q4Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q4Reg) {
                              q4Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q4 = q4Temp
                      }
                      if (questions.q5) {
                        let q5Temp: string = ""
                        questions.q5 = [...new Set(questions.q5)]; /* elimino duplicados */
                        questions.q5.map((q5Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q5Reg) {
                              q5Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q5 = q5Temp
                      }
                      if (questions.q6) {
                        let q6Temp: string = ""
                        questions.q6 = [...new Set(questions.q6)]; /* elimino duplicados */
                        questions.q6.map((q6Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q6Reg) {
                              q6Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q6 = q6Temp
                      }
                      if (questions.q7) {
                        let q7Temp: string = ""
                        questions.q7 = [...new Set(questions.q7)]; /* elimino duplicados */
                        questions.q7.map((q7Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q7Reg) {
                              q7Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q7 = q7Temp
                      }
                      if (questions.q8) {
                        let q8Temp: string = ""
                        questions.q8 = [...new Set(questions.q8)]; /* elimino duplicados */
                        questions.q8.map((q8Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q8Reg) {
                              q8Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q8 = q8Temp
                      }
                      if (questions.q9) {
                        let q9Temp: string = ""
                        questions.q9 = [...new Set(questions.q9)]; /* elimino duplicados */
                        questions.q9.map((q9Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q9Reg) {
                              q9Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q9 = q9Temp
                      }
                      if (questions.q10) {
                        let q10Temp: string = ""
                        questions.q10 = [...new Set(questions.q10)]; /* elimino duplicados */
                        questions.q10.map((q10Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q10Reg) {
                              q10Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q10 = q10Temp
                      }
                      if (questions.q11) {
                        let q11Temp: string = ""
                        questions.q11 = [...new Set(questions.q11)]; /* elimino duplicados */
                        questions.q11.map((q11Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q11Reg) {
                              q11Temp += "<td> "+regulation.Ambito+"</td><td>"+regulation.Titulo+`</td><td> <a href='${regulation.link}'>`+regulation.link+"</a> </td><br>"
                            }
                        }
                        )
                        })
                        questions.q11 = q11Temp
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
        this.regulationList = regulations
      })
}
}
