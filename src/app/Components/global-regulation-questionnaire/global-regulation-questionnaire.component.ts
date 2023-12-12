import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { Question, QuestionDTO, vectorStateDetail } from 'src/app/Models/question.dto';
import {
    UntypedFormControl,
    FormGroup, FormBuilder 
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



@Component({
  selector: 'app-global-regulation-questionnaire',
  templateUrl: './global-regulation-questionnaire.component.html',
  styleUrls: ['./global-regulation-questionnaire.component.scss']
})

export class GlobalRegulationQuestionnaireComponent {

private userId: string | null
questionnaireVectorState: vectorStateDetail [] = []
vectorStateItem: vectorStateDetail = {vectorId: '', vectorName: '', vectorGeneralRegulation: [], totalQuestions: 0, totalAnswers: 0}
vectorId: UntypedFormControl
vectorName: UntypedFormControl
vectorGeneralRegulation: UntypedFormControl
questions: UntypedFormControl

questionListForm: FormGroup = this.formBuilder.group({});

questionList: QuestionDTO[]
panelOpenState: boolean = true;
vectorProgress: number[] = [0,0,0,0,0,0,0]
totalVectorQuestions: number[] = []
totalVectorAnswers: number[] = [0]

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
vector_2_Question1_reg : string [] = []
vector_2_Question2_reg : string [] = []
vector_2_Question3_reg : string [] = []
vector_2_Question4_reg : string [] = []
vector_2_Question5_reg : string [] = []
vector_2_Question1_answers: boolean [] = []
vector_2_Question2_answers: boolean [] = []
vector_2_Question3_answers: boolean [] = []
vector_2_Question4_answers: boolean [] = []
vector_2_Question5_answers: boolean [] = []
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
vector_6_Question5: NodeListOf<HTMLElement>
vector_6_Question1_reg : string [] = []
vector_6_Question2_reg : string [] = []
vector_6_Question3_reg : string [] = []
vector_6_Question4_reg : string [] = []
vector_6_Question5_reg : string [] = []
vector_6_Question1_answers: boolean [] = []
vector_6_Question2_answers: boolean [] = []
vector_6_Question3_answers: boolean [] = []
vector_6_Question4_answers: boolean [] = []
vector_6_Question5_answers: boolean [] = []

vector_7_Question1: NodeListOf<HTMLElement>
vector_7_Question2: NodeListOf<HTMLElement>
vector_7_Question3: NodeListOf<HTMLElement>
vector_7_Question4: NodeListOf<HTMLElement>
vector_7_Question5: NodeListOf<HTMLElement>
vector_7_Question1_reg : string [] = []
vector_7_Question2_reg : string [] = []
vector_7_Question3_reg : string [] = []
vector_7_Question4_reg : string [] = []
vector_7_Question5_reg : string [] = []
vector_7_Question1_answers: boolean [] = []
vector_7_Question2_answers: boolean [] = []
vector_7_Question3_answers: boolean [] = []

constructor (
  private formBuilder: FormBuilder,
  private jwtHelper: JwtHelperService,
  private enviromentalAuditService: EnvironmentalAuditsService,
  public dialog: MatDialog
) {
  this.userId = this.jwtHelper.decodeToken().id_ils
  this.vectorId = new UntypedFormControl();
  this.vectorName = new UntypedFormControl();
  this.vectorGeneralRegulation = new UntypedFormControl();
  this.questions = new UntypedFormControl();
  this.questionListForm = this.formBuilder.group({})
}

ngOnInit() {
  this.loadQuestions()
}

private loadQuestions(): void {
  this.enviromentalAuditService.getQuestionList()
    .subscribe( (questions:QuestionDTO[]) => {
      this.questionList = questions
      questions.map( (vector:QuestionDTO) => {
        this.totalVectorQuestions.push(vector['questions'].length)
         this.vectorStateItem = {vectorId: vector.vectorId, vectorName:  vector.vectorName, vectorGeneralRegulation: vector.vectorGeneralRegulation, totalQuestions: vector.questions.length, totalAnswers: 0}
          this.questionnaireVectorState = [...this.questionnaireVectorState, this.vectorStateItem]
      })
    })
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
  let vector2Progress1: number, vector2Progress2: number, vector2Progress3: number, vector2Progress4: number, vector2Progress5: number = 0
  let vector3Progress1: number, vector3Progress2: number, vector3Progress3: number = 0
  let vector4Progress1: number, vector4Progress2: number, vector4Progress3: number, vector4Progress4: number, vector4Progress5: number, vector4Progress6: number, vector4Progress7: number = 0
  let vector5Progress1: number, vector5Progress2: number, vector5Progress3: number, vector5Progress4: number, vector5Progress5: number = 0
  let vector6Progress1: number, vector6Progress2: number, vector6Progress3: number, vector6Progress4: number, vector6Progress5: number = 0
  let vector7Progress1: number, vector7Progress2: number, vector7Progress3: number, vector7Progress4: number, vector7Progress5: number = 0

  this.vector_1_Question1 = document.getElementsByName('vector_1_Question1')
  this.vector_1_Question2 = document.getElementsByName('vector_1_Question2')
  this.vector_1_Question3 = document.getElementsByName('vector_1_Question3')
  this.vector_1_Question4 = document.getElementsByName('vector_1_Question4')
  this.vector_2_Question1 = document.getElementsByName('vector_2_Question1')
  this.vector_2_Question2 = document.getElementsByName('vector_2_Question2')
  this.vector_2_Question3 = document.getElementsByName('vector_2_Question3')
  this.vector_2_Question4 = document.getElementsByName('vector_2_Question4')
  this.vector_2_Question5 = document.getElementsByName('vector_2_Question5')
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

  this.vector_1_Question1_answers = []
  this.vector_1_Question2_answers = []
  this.vector_1_Question3_answers = []
  this.vector_1_Question4_answers = []
  this.vector_2_Question1_answers = []
  this.vector_2_Question2_answers = []
  this.vector_2_Question3_answers = []
  this.vector_2_Question4_answers = []
  this.vector_2_Question5_answers = []
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
    if(item.vectorId === '1') {
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
  this.vectorProgress[1] = vector2Progress1 + vector2Progress2 + vector2Progress3 + vector2Progress4 + vector2Progress5
  this.questionnaireVectorState.map(item=> {
    if(item.vectorId === '2') {
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
    if(item.vectorId === '3') {
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
    if(item.vectorId === '4') {
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
    if(item.vectorId === '5') {
        item.totalAnswers = this.vectorProgress[4]
    }
  })

  let progressPanel = document.getElementById('progress-panel')

  progressPanel.innerHTML = JSON.stringify(this.questionnaireVectorState)
  
  progressPanel.classList.remove('no-display')
}

saveQuestionForm() {
  let resultsQuestionnaire: string[] = []

  let resultsVector1 = document.getElementById('results-vector1')
  let resultsVector2 = document.getElementById('results-vector2')
  let resultsVector3 = document.getElementById('results-vector3')
  let resultsVector4 = document.getElementById('results-vector4')
  let resultsVector5 = document.getElementById('results-vector5')
  let resultsVector6 = document.getElementById('results-vector6')
  let resultsVector7 = document.getElementById('results-vector7')

  this.vector_1_Question1_reg = []
  this.vector_1_Question2_reg = []
  this.vector_1_Question3_reg = []
  this.vector_1_Question4_reg = []
  this.vector_2_Question1_reg = []
  this.vector_2_Question2_reg = []
  this.vector_2_Question3_reg = []
  this.vector_2_Question4_reg = []
  this.vector_2_Question5_reg = []
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
/* VECTOR 1 */
if (this.vector_1_Question1) {
  this.vector_1_Question1.forEach((node: HTMLInputElement) => {
    if (node.value && node.checked) {
      this.vector_1_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
    }
  })
}
if (this.vector_1_Question2) {
  this.vector_1_Question2.forEach((node: HTMLInputElement) => {
  if (node.value && node.checked) {
    this.vector_1_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_1_Question3) {
  this.vector_1_Question3.forEach((node: HTMLInputElement) => {
  if (node.value && node.checked) {
    this.vector_1_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_1_Question4) {
  this.vector_1_Question4.forEach((node: HTMLInputElement) => {
  if (node.value && node.checked) {
    this.vector_1_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
/* VECTOR 2 */
if (this.vector_2_Question1){
  this.vector_2_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_2_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_2_Question2){
  this.vector_2_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_2_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_2_Question3){
  this.vector_2_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_2_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_2_Question4){
  this.vector_2_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_2_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_2_Question5){
  this.vector_2_Question5.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_2_Question5_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
/* VECTOR 3 */
if (this.vector_3_Question1){
  this.vector_3_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_3_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_3_Question2){
  this.vector_3_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_3_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_3_Question3){
  this.vector_3_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_3_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
/* VECTOR 4 */
if (this.vector_4_Question1){
  this.vector_4_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_4_Question2){
  this.vector_4_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_4_Question3){
  this.vector_4_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_4_Question4){
  this.vector_4_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_4_Question5){
  this.vector_4_Question5.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question5_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_4_Question6){
  this.vector_4_Question6.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question6_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_4_Question7){
  this.vector_4_Question7.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_4_Question7_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
/* VECTOR 5 */
if (this.vector_5_Question1){
  this.vector_5_Question1.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_5_Question1_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_5_Question2){
  this.vector_5_Question2.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_5_Question2_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_5_Question3){
  this.vector_5_Question3.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_5_Question3_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_5_Question4){
  this.vector_5_Question4.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_5_Question4_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}
if (this.vector_5_Question5){
  this.vector_5_Question5.forEach((node: HTMLInputElement, index) => {
  if (node.value && node.checked) {
    this.vector_5_Question5_reg.push(node.id+'#'+node.value+'#'+node.checked+'<br>')
  }
  })
}

resultsVector1.innerHTML = this.vector_1_Question1_reg+" "+this.vector_1_Question2_reg+" "+this.vector_1_Question3_reg+" "+this.vector_1_Question4_reg
resultsVector2.innerHTML = this.vector_2_Question1_reg+" "+this.vector_2_Question2_reg+" "+this.vector_2_Question3_reg+" "+this.vector_2_Question4_reg+" "+this.vector_2_Question5_reg
resultsVector3.innerHTML = this.vector_3_Question1_reg+" "+this.vector_3_Question2_reg+" "+this.vector_3_Question3_reg
resultsVector4.innerHTML = this.vector_4_Question1_reg+" "+this.vector_4_Question2_reg+" "+this.vector_4_Question3_reg+" "+this.vector_4_Question4_reg+" "+this.vector_4_Question5_reg+" "+this.vector_4_Question6_reg+" "+this.vector_4_Question7_reg
resultsVector5.innerHTML = this.vector_5_Question1_reg+" "+this.vector_5_Question2_reg+" "+this.vector_5_Question3_reg+" "+this.vector_5_Question4_reg+" "+this.vector_5_Question5_reg

resultsVector1.classList.remove('no-display')
resultsVector2.classList.remove('no-display')
resultsVector3.classList.remove('no-display')
resultsVector4.classList.remove('no-display')
resultsVector5.classList.remove('no-display')

resultsQuestionnaire.push(resultsVector1.innerHTML)
resultsQuestionnaire.push(resultsVector2.innerHTML)
resultsQuestionnaire.push(resultsVector3.innerHTML)
resultsQuestionnaire.push(resultsVector4.innerHTML)
resultsQuestionnaire.push(resultsVector5.innerHTML)

this.enviromentalAuditService.createGlobalAnswer(resultsQuestionnaire, this.userId, this.questionnaireVectorState)
.subscribe()
}
}
