import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { Question, QuestionDTO, vectorStateDetail } from 'src/app/Models/question.dto';
import {
    UntypedFormControl,
    FormGroup, FormBuilder, Validators 
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent, MatDialogConfig
} from '@angular/material/dialog';

import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { AnswerDTO } from 'src/app/Models/answer.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { DelegationService } from 'src/app/Services/delegation.service';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-global-regulation-questionnaire',
  templateUrl: './global-regulation-questionnaire.component.html',
  styleUrls: ['./global-regulation-questionnaire.component.scss']
})

export class GlobalRegulationQuestionnaireComponent {

private userId: string | null
questionnaireVectorState: vectorStateDetail [] = []
vectorStateItem: vectorStateDetail = {vectorId: 0, vectorName: '', vectorGeneralRegulation: [], totalQuestions: 0, totalAnswers: 0}
vectorId: UntypedFormControl
vectorName: UntypedFormControl
vectorGeneralRegulation: UntypedFormControl
questions: UntypedFormControl
delegation: UntypedFormControl

questionListForm: FormGroup = this.formBuilder.group({});

questionList: QuestionDTO[]
panelOpenState: boolean = true;
vectorProgress: number[] = [0,0,0,0,0,0,0]
totalVectorQuestions: number[] = []
totalVectorAnswers: number[] = [0]

delegations!: DelegationDTO[];

vector_1_Question1: NodeListOf<HTMLElement> 
vector_1_Question2: NodeListOf<HTMLElement> 
vector_1_Question3: NodeListOf<HTMLElement> 
vector_1_Question4: NodeListOf<HTMLElement>
vector_1_Question1_reg : string [] = []
vector_1_Question2_reg : string [] = []
vector_1_Question3_reg : string [] = []
vector_1_Question4_reg : string [] = []
vector_1_Question1_answers: boolean [] = []
vector_1_Question2_answers: boolean [] = []
vector_1_Question3_answers: boolean [] = []
vector_1_Question4_answers: boolean [] = []

vector_2_Question1: NodeListOf<HTMLElement> 
vector_2_Question2: NodeListOf<HTMLElement>
vector_2_Question3: NodeListOf<HTMLElement>
vector_2_Question4: NodeListOf<HTMLElement>
vector_2_Question5: NodeListOf<HTMLElement>
vector_2_Question6: NodeListOf<HTMLElement> 
vector_2_Question7: NodeListOf<HTMLElement>
vector_2_Question8: NodeListOf<HTMLElement>
vector_2_Question9: NodeListOf<HTMLElement>
vector_2_Question10: NodeListOf<HTMLElement>
vector_2_Question11: NodeListOf<HTMLElement>

vector_2_Question1_reg : string [] = []
vector_2_Question2_reg : string [] = []
vector_2_Question3_reg : string [] = []
vector_2_Question4_reg : string [] = []
vector_2_Question5_reg : string [] = []
vector_2_Question6_reg : string [] = []
vector_2_Question7_reg : string [] = []
vector_2_Question8_reg : string [] = []
vector_2_Question9_reg : string [] = []
vector_2_Question10_reg : string [] = []
vector_2_Question11_reg : string [] = []

vector_2_Question1_answers: boolean [] = []
vector_2_Question2_answers: boolean [] = []
vector_2_Question3_answers: boolean [] = []
vector_2_Question4_answers: boolean [] = []
vector_2_Question5_answers: boolean [] = []
vector_2_Question6_answers: boolean [] = []
vector_2_Question7_answers: boolean [] = []
vector_2_Question8_answers: boolean [] = []
vector_2_Question9_answers: boolean [] = []
vector_2_Question10_answers: boolean [] = []
vector_2_Question11_answers: boolean [] = []

vector_3_Question1: NodeListOf<HTMLElement>
vector_3_Question2: NodeListOf<HTMLElement>
vector_3_Question3: NodeListOf<HTMLElement>
vector_3_Question1_reg : string [] = []
vector_3_Question2_reg : string [] = []
vector_3_Question3_reg : string [] = []
vector_3_Question1_answers: boolean [] = []
vector_3_Question2_answers: boolean [] = []
vector_3_Question3_answers: boolean [] = []

vector_4_Question1: NodeListOf<HTMLElement>
vector_4_Question2: NodeListOf<HTMLElement>
vector_4_Question3: NodeListOf<HTMLElement>
vector_4_Question4: NodeListOf<HTMLElement>
vector_4_Question5: NodeListOf<HTMLElement>
vector_4_Question6: NodeListOf<HTMLElement>
vector_4_Question7: NodeListOf<HTMLElement>
vector_4_Question1_reg : string [] = []
vector_4_Question2_reg : string [] = []
vector_4_Question3_reg : string [] = []
vector_4_Question4_reg : string [] = []
vector_4_Question5_reg : string [] = []
vector_4_Question6_reg : string [] = []
vector_4_Question7_reg : string [] = []
vector_4_Question1_answers: boolean [] = []
vector_4_Question2_answers: boolean [] = []
vector_4_Question3_answers: boolean [] = []
vector_4_Question4_answers: boolean [] = []
vector_4_Question5_answers: boolean [] = []
vector_4_Question6_answers: boolean [] = []
vector_4_Question7_answers: boolean [] = []

vector_5_Question1: NodeListOf<HTMLElement>
vector_5_Question2: NodeListOf<HTMLElement>
vector_5_Question3: NodeListOf<HTMLElement>
vector_5_Question4: NodeListOf<HTMLElement>
vector_5_Question5: NodeListOf<HTMLElement>
vector_5_Question1_reg : string [] = []
vector_5_Question2_reg : string [] = []
vector_5_Question3_reg : string [] = []
vector_5_Question4_reg : string [] = []
vector_5_Question5_reg : string [] = []
vector_5_Question1_answers: boolean [] = []
vector_5_Question2_answers: boolean [] = []
vector_5_Question3_answers: boolean [] = []
vector_5_Question4_answers: boolean [] = []
vector_5_Question5_answers: boolean [] = []

vector_6_Question1: NodeListOf<HTMLElement>
vector_6_Question2: NodeListOf<HTMLElement>
vector_6_Question3: NodeListOf<HTMLElement>
vector_6_Question4: NodeListOf<HTMLElement>
vector_6_Question1_reg : string [] = []
vector_6_Question2_reg : string [] = []
vector_6_Question3_reg : string [] = []
vector_6_Question4_reg : string [] = []
vector_6_Question1_answers: boolean [] = []
vector_6_Question2_answers: boolean [] = []
vector_6_Question3_answers: boolean [] = []
vector_6_Question4_answers: boolean [] = []

constructor (
  private formBuilder: FormBuilder,
  private jwtHelper: JwtHelperService,
  private enviromentalAuditService: EnvironmentalAuditsService,
  public dialog: MatDialog,
  private router: Router,
  private delegationService: DelegationService,
  private sharedService: SharedService,
) {
  this.userId = this.jwtHelper.decodeToken().id_ils
  this.vectorId = new UntypedFormControl();
  this.vectorName = new UntypedFormControl();
  this.vectorGeneralRegulation = new UntypedFormControl();
  this.questions = new UntypedFormControl();

  this.delegation = new UntypedFormControl('', [ Validators.required ]);

  this.questionListForm = this.formBuilder.group({
    delegation: this.delegation,
  })
}

ngOnInit() {
  this.loadDelegations(this.userId)
  this.loadQuestions()
}

private loadQuestions(): void {
  this.enviromentalAuditService.getQuestionList()
    .subscribe( (questions:QuestionDTO[]) => {
      this.questionList = questions
      questions.map( (vector:QuestionDTO) => {
        this.totalVectorQuestions.push(vector['questions'].length)
         this.vectorStateItem = {vectorId: +vector.vectorId, vectorName:  vector.vectorName, vectorGeneralRegulation: vector.vectorGeneralRegulation, totalQuestions: vector.questions.length, totalAnswers: 0}
          this.questionnaireVectorState = [...this.questionnaireVectorState, this.vectorStateItem]
      })
    })
}

private loadDelegations(userId: string): void {
  let errorResponse: any;
  if (userId) {
    this.delegationService.getAllDelegationsByCompanyIdFromMySQL(userId).subscribe(
      (delegations: DelegationDTO[]) => {
        this.delegations = delegations;
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }
}

openDialog(enterAnimationDuration: string, exitAnimationDuration: string, questionText: string, toolTipText: string, doc1: string, doc2: string): void {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = false
  dialogConfig.autoFocus = true
  dialogConfig.panelClass = "dialog-customization"
  dialogConfig.backdropClass = "popupBackdropClass"
  dialogConfig.position = {
    'top': '2rem',
    'right': '5rem'
  };
  dialogConfig.width='100%',
  dialogConfig.data = {
    questionText: questionText, toolTipText: toolTipText, doc1: doc1, doc2: doc2
  };
  this.dialog.open(ConfirmDialogComponent, dialogConfig);
}

saveAnswer(e: any) {
  
  let vector1Progress1: number, vector1Progress2: number, vector1Progress3: number, vector1Progress4: number = 0
  let vector2Progress1: number, vector2Progress2: number, vector2Progress3: number, vector2Progress4: number, vector2Progress5: number, vector2Progress6: number, vector2Progress7: number, vector2Progress8: number, vector2Progress9: number, vector2Progress10: number, vector2Progress11: number = 0
  let vector3Progress1: number, vector3Progress2: number, vector3Progress3: number = 0
  let vector4Progress1: number, vector4Progress2: number, vector4Progress3: number, vector4Progress4: number, vector4Progress5: number, vector4Progress6: number, vector4Progress7: number = 0
  let vector5Progress1: number, vector5Progress2: number, vector5Progress3: number, vector5Progress4: number, vector5Progress5: number = 0
  let vector6Progress1: number, vector6Progress2: number, vector6Progress3: number, vector6Progress4: number = 0

  this.vector_1_Question1 = document.getElementsByName('vector_1_Question1')
  this.vector_1_Question2 = document.getElementsByName('vector_1_Question2')
  this.vector_1_Question3 = document.getElementsByName('vector_1_Question3')
  this.vector_1_Question4 = document.getElementsByName('vector_1_Question4')

  this.vector_2_Question1 = document.getElementsByName('vector_2_Question1')
  this.vector_2_Question2 = document.getElementsByName('vector_2_Question2')
  this.vector_2_Question3 = document.getElementsByName('vector_2_Question3')
  this.vector_2_Question4 = document.getElementsByName('vector_2_Question4')
  this.vector_2_Question5 = document.getElementsByName('vector_2_Question5')
  this.vector_2_Question6 = document.getElementsByName('vector_2_Question6')
  this.vector_2_Question7 = document.getElementsByName('vector_2_Question7')
  this.vector_2_Question8 = document.getElementsByName('vector_2_Question8')
  this.vector_2_Question9 = document.getElementsByName('vector_2_Question9')
  this.vector_2_Question10 = document.getElementsByName('vector_2_Question10')
  this.vector_2_Question11 = document.getElementsByName('vector_2_Question11')

  this.vector_3_Question1 = document.getElementsByName('vector_3_Question1')
  this.vector_3_Question2 = document.getElementsByName('vector_3_Question2')
  this.vector_3_Question3 = document.getElementsByName('vector_3_Question3')

  this.vector_4_Question1 = document.getElementsByName('vector_4_Question1')
  this.vector_4_Question2 = document.getElementsByName('vector_4_Question2')
  this.vector_4_Question3 = document.getElementsByName('vector_4_Question3')
  this.vector_4_Question4 = document.getElementsByName('vector_4_Question4')
  this.vector_4_Question5 = document.getElementsByName('vector_4_Question5')
  this.vector_4_Question6 = document.getElementsByName('vector_4_Question6')
  this.vector_4_Question7 = document.getElementsByName('vector_4_Question7')

  this.vector_5_Question1 = document.getElementsByName('vector_5_Question1')
  this.vector_5_Question2 = document.getElementsByName('vector_5_Question2')
  this.vector_5_Question3 = document.getElementsByName('vector_5_Question3')
  this.vector_5_Question4 = document.getElementsByName('vector_5_Question4')
  this.vector_5_Question5 = document.getElementsByName('vector_5_Question5')

  this.vector_6_Question1 = document.getElementsByName('vector_6_Question1')
  this.vector_6_Question2 = document.getElementsByName('vector_6_Question2')
  this.vector_6_Question3 = document.getElementsByName('vector_6_Question3')
  this.vector_6_Question4 = document.getElementsByName('vector_6_Question4')

  this.vector_1_Question1_answers = []
  this.vector_1_Question2_answers = []
  this.vector_1_Question3_answers = []
  this.vector_1_Question4_answers = []

  this.vector_2_Question1_answers = []
  this.vector_2_Question2_answers = []
  this.vector_2_Question3_answers = []
  this.vector_2_Question4_answers = []
  this.vector_2_Question5_answers = []
  this.vector_2_Question6_answers = []
  this.vector_2_Question7_answers = []
  this.vector_2_Question8_answers = []
  this.vector_2_Question9_answers = []
  this.vector_2_Question10_answers = []
  this.vector_2_Question11_answers = []

  this.vector_3_Question1_answers = []
  this.vector_3_Question2_answers = []
  this.vector_3_Question3_answers = []

  this.vector_4_Question1_answers = []
  this.vector_4_Question2_answers = []
  this.vector_4_Question3_answers = []
  this.vector_4_Question4_answers = []
  this.vector_4_Question5_answers = []
  this.vector_4_Question6_answers = []
  this.vector_4_Question7_answers = []

  this.vector_5_Question1_answers = []
  this.vector_5_Question2_answers = []
  this.vector_5_Question3_answers = []
  this.vector_5_Question4_answers = []
  this.vector_5_Question5_answers = []

  this.vector_6_Question1_answers = []
  this.vector_6_Question2_answers = []
  this.vector_6_Question3_answers = []
  this.vector_6_Question4_answers = []

this.totalVectorAnswers = []
/* VECTOR 1 */
  this.vector_1_Question1.forEach((node: HTMLInputElement) => {
    this.vector_1_Question1_answers.push(node.checked)
  })
  this.vector_1_Question2.forEach((node: HTMLInputElement) => {
    this.vector_1_Question2_answers.push(node.checked)
  })
  this.vector_1_Question3.forEach((node: HTMLInputElement) => {
    this.vector_1_Question3_answers.push(node.checked)
  })
  this.vector_1_Question4.forEach((node: HTMLInputElement) => {
    this.vector_1_Question4_answers.push(node.checked)
  })

  if (this.vector_1_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress1 = (100/this.totalVectorQuestions[0])
  }
  if (this.vector_1_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress1 = 0
  }
  if (this.vector_1_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress2 = (100/this.totalVectorQuestions[0])
  }
  if (this.vector_1_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress2 = 0
  }
  if (this.vector_1_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress3 = (100/this.totalVectorQuestions[0])
  }
  if (this.vector_1_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress3 = 0
  }
  if (this.vector_1_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress4 = (100/this.totalVectorQuestions[0])
  }
  if (this.vector_1_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress4 = 0
  }
  this.vectorProgress[0] = vector1Progress1 + vector1Progress2 + vector1Progress3 + vector1Progress4
  this.questionnaireVectorState.map(item=> {
    if(item.vectorId === 1) {
        item.totalAnswers = this.vectorProgress[0]
    }
  })

/* VECTOR 2 */
  this.vector_2_Question1.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question1_answers.push(node.checked)
  })
  this.vector_2_Question2.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question2_answers.push(node.checked)
  })
  this.vector_2_Question3.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question3_answers.push(node.checked)
  })
  this.vector_2_Question4.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question4_answers.push(node.checked)
  })
  this.vector_2_Question5.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question5_answers.push(node.checked)
  })
  this.vector_2_Question6.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question6_answers.push(node.checked)
  })
  this.vector_2_Question7.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question7_answers.push(node.checked)
  })
  this.vector_2_Question8.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question8_answers.push(node.checked)
  })
  this.vector_2_Question9.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question9_answers.push(node.checked)
  })
  this.vector_2_Question10.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question10_answers.push(node.checked)
  })
  this.vector_2_Question11.forEach((node: HTMLInputElement, index) => {
    this.vector_2_Question11_answers.push(node.checked)
  })

  if (this.vector_2_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress1 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress1 = 0
  }
  if (this.vector_2_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress2 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress2 = 0
  }
  if (this.vector_2_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress3 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress3 = 0
  }
  if (this.vector_2_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress4 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress4 = 0
  }
  if (this.vector_2_Question5_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress5 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question5_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress5 = 0
  }
  if (this.vector_2_Question6_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress6 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question6_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress6 = 0
  }
  if (this.vector_2_Question7_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress7 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question7_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress7 = 0
  }
  if (this.vector_2_Question8_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress8 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question8_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress8 = 0
  }
  if (this.vector_2_Question9_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress9 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question9_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress9 = 0
  }
  if (this.vector_2_Question10_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress10 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question10_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress10 = 0
  }
  if (this.vector_2_Question11_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress11 = (100/this.totalVectorQuestions[1])
  }
  if (this.vector_2_Question11_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress11 = 0
  }

  this.vectorProgress[1] = vector2Progress1 + vector2Progress2 + vector2Progress3 + vector2Progress4 + vector2Progress5 + vector2Progress6 + vector2Progress7 + vector2Progress8 + vector2Progress9 + vector2Progress10 + vector2Progress11
  this.questionnaireVectorState.map(item=> {
    if(item.vectorId === 2) {
        item.totalAnswers = this.vectorProgress[1]
    }
  })

/* VECTOR 3 */
  this.vector_3_Question1.forEach((node: HTMLInputElement, index) => {
    this.vector_3_Question1_answers.push(node.checked)
  })
  this.vector_3_Question2.forEach((node: HTMLInputElement, index) => {
    this.vector_3_Question2_answers.push(node.checked)
  })
  this.vector_3_Question3.forEach((node: HTMLInputElement, index) => {
    this.vector_3_Question3_answers.push(node.checked)
  })
  if (this.vector_3_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector3Progress1 = (100/this.totalVectorQuestions[2])
  }
  if (this.vector_3_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector3Progress1 = 0
  }
  if (this.vector_3_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector3Progress2 = (100/this.totalVectorQuestions[2])
  }
  if (this.vector_3_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector3Progress2 = 0
  }
  if (this.vector_3_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector3Progress3 = (100/this.totalVectorQuestions[2])
  }
  if (this.vector_3_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector3Progress3 = 0
  }
  this.vectorProgress[2] = vector3Progress1 + vector3Progress2 + vector3Progress3
  this.questionnaireVectorState.map(item=> {
    if(item.vectorId === 3) {
        item.totalAnswers = this.vectorProgress[2]
    }
  })
/* VECTOR 4 */
  this.vector_4_Question1.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question1_answers.push(node.checked)
  })
  this.vector_4_Question2.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question2_answers.push(node.checked)
  })
  this.vector_4_Question3.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question3_answers.push(node.checked)
  })
  this.vector_4_Question4.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question4_answers.push(node.checked)
  })
  this.vector_4_Question5.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question5_answers.push(node.checked)
  })
  this.vector_4_Question6.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question6_answers.push(node.checked)
  })
  this.vector_4_Question7.forEach((node: HTMLInputElement, index) => {
    this.vector_4_Question7_reg.push(node.id+'#'+node.value+'#'+node.checked)
    this.vector_4_Question7_answers.push(node.checked)
  })
  if (this.vector_4_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress1 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress1 = 0
  }
  if (this.vector_4_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress2 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress2 = 0
  }
  if (this.vector_4_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress3 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress3 = 0
  }
  if (this.vector_4_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress4 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress4 = 0
  }
  if (this.vector_4_Question5_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress5 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question5_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress5 = 0
  }
  if (this.vector_4_Question6_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress6 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question6_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress6 = 0
  }
  if (this.vector_4_Question7_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress7 = (100/this.totalVectorQuestions[3])
  }
  if (this.vector_4_Question7_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress7 = 0
  }
  this.vectorProgress[3] = vector4Progress1 + vector4Progress2 + vector4Progress3 + vector4Progress4 + vector4Progress5 + vector4Progress6 + vector4Progress7
  this.questionnaireVectorState.map(item=> {
    if(item.vectorId === 4) {
        item.totalAnswers = this.vectorProgress[3]
    }
  })

/* VECTOR 5 */
  this.vector_5_Question1.forEach((node: HTMLInputElement, index) => {
    this.vector_5_Question1_answers.push(node.checked)
  })
  this.vector_5_Question2.forEach((node: HTMLInputElement, index) => {
    this.vector_5_Question2_answers.push(node.checked)
  })
  this.vector_5_Question3.forEach((node: HTMLInputElement, index) => {
    this.vector_5_Question3_answers.push(node.checked)
  })
  this.vector_5_Question4.forEach((node: HTMLInputElement, index) => {
    this.vector_5_Question4_answers.push(node.checked)
  })
  this.vector_5_Question5.forEach((node: HTMLInputElement, index) => {
    this.vector_5_Question5_answers.push(node.checked)
  })
  if (this.vector_5_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress1 = (100/this.totalVectorQuestions[4])
  }
  if (this.vector_5_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress1 = 0
  }
  if (this.vector_5_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress2 = (100/this.totalVectorQuestions[4])
  }
  if (this.vector_5_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress2 = 0
  }
  if (this.vector_5_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress3 = (100/this.totalVectorQuestions[4])
  }
  if (this.vector_5_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress3 = 0
  }
  if (this.vector_5_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress4 = (100/this.totalVectorQuestions[4])
  }
  if (this.vector_5_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress4 = 0
  }
  if (this.vector_5_Question5_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress5 = (100/this.totalVectorQuestions[4])
  }
  if (this.vector_5_Question5_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress5 = 0
  }
  this.vectorProgress[4] = vector5Progress1 + vector5Progress2 + vector5Progress3 + vector5Progress4 + vector5Progress5
  this.questionnaireVectorState.map(item=> {
    if(item.vectorId === 5) {
        item.totalAnswers = this.vectorProgress[4]
    }
  })

/* VECTOR 6 */
this.vector_6_Question1.forEach((node: HTMLInputElement, index) => {
  this.vector_6_Question1_answers.push(node.checked)
})
this.vector_6_Question2.forEach((node: HTMLInputElement, index) => {
  this.vector_6_Question2_answers.push(node.checked)
})
this.vector_6_Question3.forEach((node: HTMLInputElement, index) => {
  this.vector_6_Question3_answers.push(node.checked)
})
this.vector_6_Question4.forEach((node: HTMLInputElement, index) => {
  this.vector_6_Question4_answers.push(node.checked)
})

if (this.vector_6_Question1_answers.some((someItem: boolean) => someItem === true) ) {
  vector6Progress1 = (100/this.totalVectorQuestions[5])
}
if (this.vector_6_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
  vector6Progress1 = 0
}
if (this.vector_6_Question2_answers.some((someItem: boolean) => someItem === true) ) {
  vector6Progress2 = (100/this.totalVectorQuestions[5])
}
if (this.vector_6_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
  vector6Progress2 = 0
}
if (this.vector_6_Question3_answers.some((someItem: boolean) => someItem === true) ) {
  vector6Progress3 = (100/this.totalVectorQuestions[5])
}
if (this.vector_6_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
  vector6Progress3 = 0
}
if (this.vector_6_Question4_answers.some((someItem: boolean) => someItem === true) ) {
  vector6Progress4 = (100/this.totalVectorQuestions[5])
}
if (this.vector_6_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
  vector6Progress4 = 0
}

this.vectorProgress[5] = vector6Progress1 + vector6Progress2 + vector6Progress3 + vector6Progress4
this.questionnaireVectorState.map(item=> {
  if(item.vectorId === 6) {
      item.totalAnswers = this.vectorProgress[5]
  }
})  

  let progressPanel = document.getElementById('progress-panel')

  progressPanel.innerHTML = JSON.stringify(this.questionnaireVectorState)
  
  //progressPanel.classList.remove('no-display')
}

saveQuestionForm() {
  let resultsQuestionnaire: string[] = []

  let resultsVector1 = document.getElementById('results-vector1')
  let resultsVector2 = document.getElementById('results-vector2')
  let resultsVector3 = document.getElementById('results-vector3')
  let resultsVector4 = document.getElementById('results-vector4')
  let resultsVector5 = document.getElementById('results-vector5')
  let resultsVector6 = document.getElementById('results-vector6')

  this.vector_1_Question1_reg = []
  this.vector_1_Question2_reg = []
  this.vector_1_Question3_reg = []
  this.vector_1_Question4_reg = []

  this.vector_2_Question1_reg = []
  this.vector_2_Question2_reg = []
  this.vector_2_Question3_reg = []
  this.vector_2_Question4_reg = []
  this.vector_2_Question5_reg = []
  this.vector_2_Question6_reg = []
  this.vector_2_Question7_reg = []
  this.vector_2_Question8_reg = []
  this.vector_2_Question9_reg = []
  this.vector_2_Question10_reg = []
  this.vector_2_Question11_reg = []

  this.vector_3_Question1_reg = []
  this.vector_3_Question2_reg = []
  this.vector_3_Question3_reg = []

  this.vector_4_Question1_reg = []
  this.vector_4_Question2_reg = []
  this.vector_4_Question3_reg = []
  this.vector_4_Question4_reg = []
  this.vector_4_Question5_reg = []
  this.vector_4_Question6_reg = []
  this.vector_4_Question7_reg = []

  this.vector_5_Question1_reg = []
  this.vector_5_Question2_reg = []
  this.vector_5_Question3_reg = []
  this.vector_5_Question4_reg = []
  this.vector_5_Question5_reg = []

  this.vector_6_Question1_reg = []
  this.vector_6_Question2_reg = []
  this.vector_6_Question3_reg = []
  this.vector_6_Question4_reg = []

/* VECTOR 1 */
if (this.vector_1_Question1) {
  this.vector_1_Question1.forEach((node: HTMLInputElement) => {
    if (node.value && node.checked) {
      /* this.vector_1_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
      this.vector_1_Question1_reg.push('{['+node.value+']}')
    }
  })
}
if (this.vector_1_Question2) {
  this.vector_1_Question2.forEach((node: HTMLInputElement) => {
  if (node.value && node.checked) {
    /* this.vector_1_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_1_Question2_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_1_Question3) {
  this.vector_1_Question3.forEach((node: HTMLInputElement) => {
  if (node.value && node.checked) {
    /* this.vector_1_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_1_Question3_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_1_Question4) {
  this.vector_1_Question4.forEach((node: HTMLInputElement) => {
  if (node.value && node.checked) {
    /* this.vector_1_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_1_Question4_reg.push('{['+node.value+']}')
  }
  })
}
/* VECTOR 2 */
if (this.vector_2_Question1){
  this.vector_2_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
   /*  this.vector_2_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
   this.vector_2_Question1_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question2){
  this.vector_2_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question2_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question3){
  this.vector_2_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question3_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question4){
  this.vector_2_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question4_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question5){
  this.vector_2_Question5.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question5_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question5_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question6){
  this.vector_2_Question6.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
   /*  this.vector_2_Question6_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
   this.vector_2_Question6_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question7){
  this.vector_2_Question7.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question7_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question7_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question8){
  this.vector_2_Question8.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question8_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question8_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question9){
  this.vector_2_Question9.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question9_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question9_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question10){
  this.vector_2_Question10.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question10_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question10_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_2_Question11){
  this.vector_2_Question11.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_2_Question11_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_2_Question11_reg.push('{['+node.value+']}')
  }
  })
}
/* VECTOR 3 */
if (this.vector_3_Question1){
  this.vector_3_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_3_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_3_Question1_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_3_Question2){
  this.vector_3_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_3_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_3_Question2_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_3_Question3){
  this.vector_3_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_3_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_3_Question3_reg.push('{['+node.value+']}')
  }
  })
}
/* VECTOR 4 */
if (this.vector_4_Question1){
  this.vector_4_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question1_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_4_Question2){
  this.vector_4_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question2_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_4_Question3){
  this.vector_4_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question3_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_4_Question4){
  this.vector_4_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question4_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_4_Question5){
  this.vector_4_Question5.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question5_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question5_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_4_Question6){
  this.vector_4_Question6.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question6_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question6_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_4_Question7){
  this.vector_4_Question7.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_4_Question7_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_4_Question7_reg.push('{['+node.value+']}')
  }
  })
}
/* VECTOR 5 */
if (this.vector_5_Question1){
  this.vector_5_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_5_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_5_Question1_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_5_Question2){
  this.vector_5_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_5_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_5_Question2_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_5_Question3){
  this.vector_5_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_5_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_5_Question3_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_5_Question4){
  this.vector_5_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_5_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_5_Question4_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_5_Question5){
  this.vector_5_Question5.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_5_Question5_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_5_Question5_reg.push('{['+node.value+']}')
  }
  })
}
/* VECTOR 6 */
if (this.vector_6_Question1){
  this.vector_6_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_6_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_6_Question1_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_6_Question2){
  this.vector_6_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_6_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_6_Question2_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_6_Question3){
  this.vector_6_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_6_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_6_Question3_reg.push('{['+node.value+']}')
  }
  })
}
if (this.vector_6_Question4){
  this.vector_6_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    /* this.vector_6_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>') */
    this.vector_6_Question4_reg.push('{['+node.value+']}')
  }
  })
}

resultsVector1.innerHTML = '[{"vectorId":1,"regulation":['+ this.vector_1_Question1_reg+','+this.vector_1_Question2_reg+','+this.vector_1_Question3_reg+','+this.vector_1_Question4_reg+']},'
resultsVector2.innerHTML = '{"vectorId":2,"regulation":['+ this.vector_2_Question1_reg+','+this.vector_2_Question2_reg+','+this.vector_2_Question3_reg+','+this.vector_2_Question4_reg+','+this.vector_2_Question5_reg+','+this.vector_2_Question6_reg+','+this.vector_2_Question7_reg+','+this.vector_2_Question8_reg+','+this.vector_2_Question9_reg+','+this.vector_2_Question10_reg+','+this.vector_2_Question11_reg+']},'
resultsVector3.innerHTML = '{"vectorId":3,"regulation":['+ this.vector_3_Question1_reg+','+this.vector_3_Question2_reg+','+this.vector_3_Question3_reg+']},'
resultsVector4.innerHTML = '{"vectorId":4,"regulation":['+ this.vector_4_Question1_reg+','+this.vector_4_Question2_reg+','+this.vector_4_Question3_reg+','+this.vector_4_Question4_reg+','+this.vector_4_Question5_reg+','+this.vector_4_Question6_reg+','+this.vector_4_Question7_reg+']},'
resultsVector5.innerHTML = '{"vectorId":5,"regulation":['+ this.vector_5_Question1_reg+','+this.vector_5_Question2_reg+','+this.vector_5_Question3_reg+','+this.vector_5_Question4_reg+','+this.vector_5_Question5_reg+']},'
resultsVector6.innerHTML = '{"vectorId":6,"regulation":['+ this.vector_6_Question1_reg+','+this.vector_6_Question2_reg+','+this.vector_6_Question3_reg+','+this.vector_6_Question4_reg+']}]'

/* resultsVector1.classList.remove('no-display')
resultsVector2.classList.remove('no-display')
resultsVector3.classList.remove('no-display')
resultsVector4.classList.remove('no-display')
resultsVector5.classList.remove('no-display')
resultsVector6.classList.remove('no-display') */

resultsQuestionnaire.push(resultsVector1.innerHTML)
resultsQuestionnaire.push(resultsVector2.innerHTML)
resultsQuestionnaire.push(resultsVector3.innerHTML)
resultsQuestionnaire.push(resultsVector4.innerHTML)
resultsQuestionnaire.push(resultsVector5.innerHTML)
resultsQuestionnaire.push(resultsVector6.innerHTML)

this.enviromentalAuditService.createGlobalAnswer(resultsQuestionnaire, this.userId, this.delegation.value, this.questionnaireVectorState)
  .subscribe((item:any) => {
    /* console.log("Navegar hacia detalle del cuestionario", "-->",item,"<-->", item.last_id,"<--") */
    this.router.navigateByUrl('/questionnaire-detail/'+`${item.last_id}`)
  }
)

}
}