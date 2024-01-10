import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'
import { ActivatedRoute, Router } from '@angular/router';
import { answeredQuestionnaire } from 'src/app/Models/answeredQuestionnaire.dto';
import { regulationsDTO } from 'src/app/Models/regulation.dto';
import { QuestionDTO } from 'src/app/Models/question.dto';

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
  vector: string[] = ["RESIDUOS","SEGURIDAD INDUSTRIAL","AGUAS","ATMÓSFERA","SUSTANCIAS Y PREPARADOS QUiMICOS","MEDIOAMBIENTE GENERAL"]

  regVector: {} = [
    {"vectorName":"RESIDUOS", "regulation":["RES_3", "RES_4", "RES_5", "RES_18", "RES_19", "RES_60", "RES_61"]},
    {"vectorName":"SEGURIDAD INDUSTRIAL", "regulation":["SIND_1", "SIND_2", "SIND_4"]},
    {"vectorName":"AGUAS", "regulation":["AGU_8"]},
    {"vectorName":"ATMÓSFERA", "regulation":["ATM_4", "ATM_5", "ATM_9", "ATM_12"]},
    {"vectorName":"SUSTANCIAS Y PREPARADOS QUiMICOS", "regulation":["Ninguna"]},
    {"vectorName":"MEDIOAMBIENTE GENERAL", "regulation":["Ninguna"]},
  ]

  questionList: QuestionDTO[]

  constructor (
    private enviromentalAuditService: EnvironmentalAuditsService,
    private jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils
  }

  ngOnInit() {
    const questionnaireID = this.route.snapshot.paramMap.get('id');
    this.loadRegulations(+questionnaireID)
    this.loadQuestions()
  }

  loadRegulations(questionnaireID: number){
    this.enviromentalAuditService.getRegulations()
      .subscribe( (regulations: any[]) => {
        this.regulationList = regulations
        console.log ("regulations: ", this.regulationList)
        this.loadQuestionnaireResult( +questionnaireID )
      })
  }

  private loadQuestions(): void {
    this.enviromentalAuditService.getQuestionList()
      .subscribe( (questions:QuestionDTO[]) => {
        this.questionList = questions
        questions.map( (vector:QuestionDTO) => {

        })
      })
  }

  loadQuestionnaireResult( questionnaireID: number){
        this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
          .subscribe( (questionnaires: AnswerDTO[]) =>{
            this.userQuestionnaires = questionnaires
            this.userQuestionnaires.map((item:AnswerDTO) =>{
              JSON.parse(item.userAnswers).map((vectorAnswers:any) => {
                let vRegTemp: string = ""
                this.regVector[(vectorAnswers.vectorId-1)].regulation.map((vReg:any) =>{
                  this.regulationList.map((regulation:regulationsDTO) => {
                    if (regulation.reg_ID == vReg) {
                     vRegTemp += "<li><span class='ambito'> "+regulation.Ambito+" </span><span> "+regulation.Titulo+`. </span><br><span><a href='${regulation.link}' target='_blank'>`+regulation.link+`</a> </span><span> [<a href='../../../assets/regulation/${vReg}.pdf' target='_blank'>`+vReg+"</a>] </span></li>"
                   }
                  })
                  console.log ("vRegTemp", vRegTemp)
                  this.regVector[(vectorAnswers.vectorId-1)].regulation = vRegTemp
                })

                vectorAnswers.vectorId = this.vector[vectorAnswers.vectorId-1]

                vectorAnswers.regulations.map((item:any) =>{
                    item.regulation.map((questions:any) =>{
                      if (questions.q1) {
                        let q1Temp: string = ""
                        questions.q1 = [...new Set(questions.q1)]; /* elimino duplicados */
                        questions.q1.map((q1Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                               if (regulation.reg_ID == q1Reg) {
                                q1Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q1Reg}.pdf' target='_blank'>`+q1Reg+"</a>]</span></li>"
                              }
                          })
                        })
                        questions.q1 = q1Temp
                      }
                      if (questions.q2) {
                        let q2Temp: string = ""
                        questions.q2 = [...new Set(questions.q2)]; /* elimino duplicados */
                        questions.q2.map((q2Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q2Reg) {
                              q2Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q2Reg}.pdf' target='_blank'>`+q2Reg+"</a>]</span></li>"
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
                              q3Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q3Reg}.pdf' target='_blank'>`+q3Reg+"</a>]</span></li>"
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
                              q4Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q4Reg}.pdf' target='_blank'>`+q4Reg+"</a>]</span></li>"
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
                              q5Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q5Reg}.pdf' target='_blank'>`+q5Reg+"</a>]</span></li>"
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
                              q6Temp += "<li><span class='ambito'> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q6Reg}.pdf' target='_blank'>`+q6Reg+"</a>]</span></li>"
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
                              q7Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q7Reg}.pdf' target='_blank'>`+q7Reg+"</a>]</span></li>"
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
                              q8Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q8Reg}.pdf' target='_blank'>`+q8Reg+"</a>]</span></li>"
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
                              q9Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q9Reg}.pdf' target='_blank'>`+q9Reg+"</a>]</span></li>"
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
                              q10Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q10Reg}.pdf' target='_blank'>`+q10Reg+"</a>]</span></li>"
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
                              q11Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q11Reg}.pdf' target='_blank'>`+q11Reg+"</a>]</span></li>"
                            }
                        }
                        )
                        })
                        questions.q11 = q11Temp
                      }
                      if (questions.q12) {
                        let q12Temp: string = ""
                        questions.q12 = [...new Set(questions.q12)]; /* elimino duplicados */
                        questions.q12.map((q12Reg:any) =>{
                          this.regulationList.map((regulation:regulationsDTO) => {
                             if (regulation.reg_ID === q12Reg) {
                              q12Temp += "<li><span> "+regulation.Ambito+" </span><span> "+regulation.Titulo+` </span><br><span> <a href='${regulation.link}' target='_blank'>`+regulation.link+`</a></span><span> [<a href='../../../assets/regulation/${q12Reg}.pdf' target='_blank'>`+q12Reg+"</a>]</span></li>"
                            }
                        }
                        )
                        })
                        questions.q12 = q12Temp
                      }
                    })
                  })
                this.userQuestionnaireTemp.push(vectorAnswers)
                console.log ("userQuestionnaireTemp", this.userQuestionnaireTemp)
              })
            })
          })
  }
}
