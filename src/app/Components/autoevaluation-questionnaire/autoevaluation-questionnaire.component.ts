import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AnswerDTO } from 'src/app/Models/answer.dto';
import { answeredQuestionnaire } from 'src/app/Models/answeredQuestionnaire.dto';
import { regulationsDTO } from 'src/app/Models/regulation.dto';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';

@Component({
  selector: 'app-autoevaluation-questionnaire',
  templateUrl: './autoevaluation-questionnaire.component.html',
  styleUrls: ['./autoevaluation-questionnaire.component.scss']
})
export class AutoevaluationQuestionnaireComponent {
  private userId: string | null
  questionnaireID: number | null
  questionaireSummaryAnwers: string[] = []
  userQuestionnaires: AnswerDTO[] = []
  userQuestionnaireTemp: answeredQuestionnaire[] = []
  regulationList: regulationsDTO[] = [] /* Listado de toda la regulación medioambiental */
  regulationListToApply: string[] = [] /* Regulación que se aplica basada en las respuestas del cuestionario preliminar */
  regVector: {} = [
    {"vectorName":"RESIDUOS", "regulation":["RES_3","RES_4","RES_5","RES_6","RES_18","RES_19","RES_22","RES_60","RES_61"]},
    {"vectorName":"SEGURIDAD INDUSTRIAL", "regulation":["Ninguna"]},
    {"vectorName":"AGUAS", "regulation":["AGU_8"]},
    {"vectorName":"ATMÓSFERA", "regulation":["ATM_47","ATM_5","ATM_9","ATM_12","ATM_50","ATM_52"]},
    {"vectorName":"SUSTANCIAS Y PREPARADOS QUÍMICOS", "regulation":["Ninguna"]},
    {"vectorName":"MEDIOAMBIENTE GENERAL", "regulation":["MA_0","MA_10","MA_1","MA_9"]},
  ]
  vector: string[] = ["RESIDUOS","SEGURIDAD INDUSTRIAL","AGUAS","ATMÓSFERA","SUSTANCIAS Y PREPARADOS QUÍMICOS","MEDIOAMBIENTE GENERAL"]

  constructor (
    private jwtHelper: JwtHelperService,
    private enviromentalAuditService: EnvironmentalAuditsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.questionnaireID = +this.route.snapshot.paramMap.get('id');
    this.userId = this.jwtHelper.decodeToken().id_ils
  }

  ngOnInit() {
    if (this.questionnaireID) {
      this.loadRegulations(this.questionnaireID)
    }
  }

  loadRegulations(questionnaireID: number){
    this.enviromentalAuditService.getRegulations()
      .subscribe( (regulations: any[]) => {
        this.regulationList = regulations
        this.loadQuestionnaireResult( +questionnaireID )
      })
  }

  loadQuestionnaireResult( questionnaireID: number ){
    this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
      .subscribe( (questionnaires: AnswerDTO[]) =>{
        this.userQuestionnaires = questionnaires
        this.userQuestionnaires.map((item:AnswerDTO) =>{
          JSON.parse(item.userAnswers).map((vectorAnswers:any) => {
            let vRegTemp: string = ""
            this.regVector[(vectorAnswers.vectorId-1)].regulation.map((vReg:any) =>{
              this.regulationList.map((regulation:regulationsDTO) => {
                if (regulation.regId == vReg) {
                  this.regulationListToApply.push(vReg)
                }
              })
              this.regVector[(vectorAnswers.vectorId-1)].regulation = vRegTemp
            })

            vectorAnswers.vectorId = this.vector[vectorAnswers.vectorId-1]
            vectorAnswers.regulations.map((item:any) =>{
                item.regulation.map((questions:any) =>{
                  if (questions.q1) {
                    questions.q1.map((q1Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                           if (regulation.regId == q1Reg) {
                            this.regulationListToApply.push(q1Reg)
                          }
                      })
                    })
                  }
                  if (questions.q2) {
                    questions.q2.map((q2Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q2Reg) {
                          this.regulationListToApply.push(q2Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q3) {
                    questions.q3.map((q3Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q3Reg) {
                          this.regulationListToApply.push(q3Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q4) {
                    questions.q4.map((q4Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q4Reg) {
                          this.regulationListToApply.push(q4Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q5) {
                    questions.q5.map((q5Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q5Reg) {
                          this.regulationListToApply.push(q5Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q6) {
                    questions.q6.map((q6Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q6Reg) {
                          this.regulationListToApply.push(q6Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q7) {
                    questions.q7.map((q7Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q7Reg) {
                          this.regulationListToApply.push(q7Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q8) {
                    questions.q8.map((q8Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q8Reg) {
                          this.regulationListToApply.push(q8Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q9) {
                    questions.q9.map((q9Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q9Reg) {
                          this.regulationListToApply.push(q9Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q10) {
                    let q10Temp: string = ""
                    questions.q10.map((q10Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q10Reg) {
                          this.regulationListToApply.push(q10Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q11) {
                    questions.q11.map((q11Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.regId === q11Reg) {
                          this.regulationListToApply.push(q11Reg)
                        }
                    }
                    )
                    })
                  }
                })
              })
            this.userQuestionnaireTemp.push(vectorAnswers)
            this.regulationListToApply = [...new Set(this.regulationListToApply)]; /* elimino duplicados */
            const node = document.createElement("li")
            this.regulationListToApply.forEach((itemReg:string)=> {
              const textnode = document.createTextNode(itemReg+" ")
              const classnode = document.createAttribute("class")
              classnode.value = "auto-eval-list"
              node.setAttributeNode(classnode)
              node.appendChild(textnode)
            })
            document.getElementById("regulation-to-apply").appendChild(node)
            this.regulationListToApply = []
          })
        })
      })
}
}
