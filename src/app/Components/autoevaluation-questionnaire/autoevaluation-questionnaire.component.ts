import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AnswerDTO } from 'src/app/Models/answer.dto';
import { answeredQuestionnaire } from 'src/app/Models/answeredQuestionnaire.dto';
import { regulationsDTO } from 'src/app/Models/regulation.dto';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { SharedService } from 'src/app/Services/shared.service';

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
    {"vectorName":"RESIDUOS", "regulation":["RES_3", "RES_4", "RES_5", "RES_18", "RES_19", "RES_60", "RES_61"]},
    {"vectorName":"SEGURIDAD INDUSTRIAL", "regulation":["SIND_1", "SIND_2", "SIND_4"]},
    {"vectorName":"AGUAS", "regulation":["AGU_8"]},
    {"vectorName":"ATMÓSFERA", "regulation":["ATM_4", "ATM_5", "ATM_9", "ATM_12"]},
    {"vectorName":"SUSTANCIAS Y PREPARADOS QUiMICOS", "regulation":["Ninguna"]},
    {"vectorName":"MEDIOAMBIENTE GENERAL", "regulation":["Ninguna"]},
  ]
  vector: string[] = ["RESIDUOS","SEGURIDAD INDUSTRIAL","AGUAS","ATMÓSFERA","SUSTANCIAS Y PREPARADOS QUiMICOS","MEDIOAMBIENTE GENERAL"]

  constructor (
    private formBuilder: FormBuilder,
    private jwtHelper: JwtHelperService,
    private enviromentalAuditService: EnvironmentalAuditsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) {
    this.questionnaireID = +this.route.snapshot.paramMap.get('id');
    this.questionnaireID = 195
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
                if (regulation.reg_ID == vReg) {
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
                           if (regulation.reg_ID == q1Reg) {
                            this.regulationListToApply.push(q1Reg)
                          }
                      })
                    })
                  }
                  if (questions.q2) {
                    questions.q2.map((q2Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q2Reg) {
                          this.regulationListToApply.push(q2Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q3) {
                    questions.q3.map((q3Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q3Reg) {
                          this.regulationListToApply.push(q3Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q4) {
                    questions.q4.map((q4Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q4Reg) {
                          this.regulationListToApply.push(q4Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q5) {
                    questions.q5.map((q5Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q5Reg) {
                          this.regulationListToApply.push(q5Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q6) {
                    questions.q6.map((q6Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q6Reg) {
                          this.regulationListToApply.push(q6Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q7) {
                    questions.q7.map((q7Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q7Reg) {
                          this.regulationListToApply.push(q7Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q8) {
                    questions.q8.map((q8Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q8Reg) {
                          this.regulationListToApply.push(q8Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q9) {
                    questions.q9.map((q9Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q9Reg) {
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
                         if (regulation.reg_ID === q10Reg) {
                          this.regulationListToApply.push(q10Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q11) {
                    questions.q11.map((q11Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q11Reg) {
                          this.regulationListToApply.push(q11Reg)
                        }
                    }
                    )
                    })
                  }
                  if (questions.q12) {
                    questions.q12.map((q12Reg:any) =>{
                      this.regulationList.map((regulation:regulationsDTO) => {
                         if (regulation.reg_ID === q12Reg) {
                          this.regulationListToApply.push(q12Reg)
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
