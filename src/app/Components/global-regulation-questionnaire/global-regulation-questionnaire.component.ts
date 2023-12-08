import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { Question, QuestionDTO } from 'src/app/Models/question.dto';
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

@Component({
  selector: 'app-global-regulation-questionnaire',
  templateUrl: './global-regulation-questionnaire.component.html',
  styleUrls: ['./global-regulation-questionnaire.component.scss']
})

export class GlobalRegulationQuestionnaireComponent {

vectorId: UntypedFormControl
vectorName: UntypedFormControl
vectorGeneralRegulation: UntypedFormControl
questions: UntypedFormControl

questionListForm: FormGroup = this.formBuilder.group({});
questionListFormTest: FormGroup = this.formBuilder.group({})

questionList: QuestionDTO[]
panelOpenState: boolean = true;
vectorProgress: number[] = [0,0,0,0,0,0,0]
totalVectorQuestions: number[] = []
totalVectorAnswers: number[] = [0]

constructor (
  private formBuilder: FormBuilder,
  private enviromentalAuditService: EnvironmentalAuditsService,
  public dialog: MatDialog
) {
  this.vectorId = new UntypedFormControl();
  this.vectorName = new UntypedFormControl();
  this.vectorGeneralRegulation = new UntypedFormControl();
  this.questions = new UntypedFormControl();
  
  this.questionListFormTest = this.formBuilder.group({})
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
      })
    })
}


getRadio(answer:string, questionNumber:string, regulation: string[], e:any, i: number, totalVectorQuestions: number){
  this.totalVectorAnswers[i] = this.totalVectorAnswers[i] + 1
  this.vectorProgress[i] = this.vectorProgress[i] + 1
  console.log (i, totalVectorQuestions, this.totalVectorAnswers[i])
  this.enviromentalAuditService.createGlobalAnswer(answer, questionNumber, regulation)
    .subscribe()

}

getCheckBox(answer:string, questionNumber:string, regulation: string[], e:any){
  if ( e.checked ) {
    this.enviromentalAuditService.updateGlobalAnswer(answer, questionNumber, regulation)
      .subscribe()
  }

}

openDialog(enterAnimationDuration: string, exitAnimationDuration: string, questionText: string, toolTipText: string, doc1: string, doc2: string): void {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true
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

saveQuestionForm(){

/*  console.log (document.getElementById('theQuestionnaire'))  */
  let vectorProgress1: number, vectorProgress2: number, vectorProgress3: number, vectorProgress4: number = 0

  let vector_1_Question1 = document.getElementsByName('vector_1_Question1') 
  let vector_1_Question2 = document.getElementsByName('vector_1_Question2') 
  let vector_1_Question3 = document.getElementsByName('vector_1_Question3') 
  let vector_1_Question4 = document.getElementsByName('vector_1_Question4')
  let vector_1_Question1_reg : string
  let vector_1_Question2_reg : string
  let vector_1_Question3_reg : string
  let vector_1_Question4_reg : string

  let vector_1_Question1_answers: boolean [] = []
  let vector_1_Question2_answers: boolean [] = []
  let vector_1_Question3_answers: boolean [] = []
  let vector_1_Question4_answers: boolean [] = []

  let vector_2_Question1 = document.getElementsByName('vector_2_Question1') 
  let vector_2_Question2 = document.getElementsByName('vector_2_Question2') 
  let vector_2_Question3 = document.getElementsByName('vector_2_Question3') 
  let vector_2_Question4 = document.getElementsByName('vector_2_Question4')
  let vector_2_Question5 = document.getElementsByName('vector_2_Question5')
  let vector_2_Question1_reg : string
  let vector_2_Question1_answers: boolean [] = []
  let vector_2_Question2_answers: boolean [] = []
  let vector_2_Question3_answers: boolean [] = []
  let vector_2_Question4_answers: boolean [] = []
  let vector_2_Question5_answers: boolean [] = []

  let vector_3_Question1 = document.getElementsByName('vector_3_Question1') 
  let vector_3_Question2 = document.getElementsByName('vector_3_Question2') 
  let vector_3_Question3 = document.getElementsByName('vector_3_Question3') 
  let vector_3_Question1_reg : string
  let vector_3_Question1_answers: boolean [] = []
  let vector_3_Question2_answers: boolean [] = []
  let vector_3_Question3_answers: boolean [] = []

  let vector_4_Question1 = document.getElementsByName('vector_4_Question1') 
  let vector_4_Question2 = document.getElementsByName('vector_4_Question2') 
  let vector_4_Question3 = document.getElementsByName('vector_4_Question3') 
  let vector_4_Question4 = document.getElementsByName('vector_4_Question4')
  let vector_4_Question5 = document.getElementsByName('vector_4_Question5')
  let vector_4_Question6 = document.getElementsByName('vector_4_Question6')
  let vector_4_Question7 = document.getElementsByName('vector_4_Question7')
  let vector_4_Question1_reg : string
  let vector_4_Question1_answers: boolean [] = []
  let vector_4_Question2_answers: boolean [] = []
  let vector_4_Question3_answers: boolean [] = []
  let vector_4_Question4_answers: boolean [] = []
  let vector_4_Question5_answers: boolean [] = []
  let vector_4_Question6_answers: boolean [] = []
  let vector_4_Question7_answers: boolean [] = []

  let vector_5_Question1 = document.getElementsByName('vector_5_Question1') 
  let vector_5_Question2 = document.getElementsByName('vector_5_Question2') 
  let vector_5_Question3 = document.getElementsByName('vector_5_Question3') 
  let vector_5_Question4 = document.getElementsByName('vector_5_Question4')
  let vector_5_Question5 = document.getElementsByName('vector_5_Question5')
  let vector_5_Question1_reg : string
  let vector_5_Question1_answers: boolean [] = []
  let vector_5_Question2_answers: boolean [] = []
  let vector_5_Question3_answers: boolean [] = []
  let vector_5_Question4_answers: boolean [] = []

  let vector_6_Question1 = document.getElementsByName('vector_6_Question1') 
  let vector_6_Question2 = document.getElementsByName('vector_6_Question2') 
  let vector_6_Question3 = document.getElementsByName('vector_6_Question3') 
  let vector_6_Question4 = document.getElementsByName('vector_6_Question4')
  let vector_6_Question5 = document.getElementsByName('vector_6_Question5')
  let vector_6_Question1_reg : string
  let vector_6_Question1_answers: boolean [] = []
  let vector_6_Question2_answers: boolean [] = []
  let vector_6_Question3_answers: boolean [] = []
  let vector_6_Question4_answers: boolean [] = []

  let vector_7_Question1 = document.getElementsByName('vector_7_Question1') 
  let vector_7_Question2 = document.getElementsByName('vector_7_Question2') 
  let vector_7_Question3 = document.getElementsByName('vector_7_Question3') 
  let vector_7_Question4 = document.getElementsByName('vector_7_Question4')
  let vector_7_Question5 = document.getElementsByName('vector_7_Question5')
  let vector_7_Question1_reg : string
  let vector_7_Question1_answers: boolean [] = []
  let vector_7_Question2_answers: boolean [] = []
  let vector_7_Question3_answers: boolean [] = []
  let vector_7_Question4_answers: boolean [] = []

/* 
totalVectorQuestions: number[] = []
totalVectorAnswers: number[] = [0] */

this.totalVectorAnswers = []

  vector_1_Question1.forEach((node: HTMLInputElement) => {
    vector_1_Question1_reg = `${node.id,node.value,node.checked}`
    vector_1_Question1_answers.push(node.checked)
  })
  vector_1_Question2.forEach((node: HTMLInputElement) => {
    vector_1_Question2_reg = `${node.id,node.value,node.checked}`
    vector_1_Question2_answers.push(node.checked)
  })
  vector_1_Question3.forEach((node: HTMLInputElement) => {
    vector_1_Question3_reg = `${node.id,node.value,node.checked}`
    vector_1_Question3_answers.push(node.checked)
  })
  vector_1_Question4.forEach((node: HTMLInputElement) => {
    vector_1_Question4_reg = `${node.id,node.value,node.checked}`
    vector_1_Question4_answers.push(node.checked)
  })
  if (vector_1_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vectorProgress1 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vectorProgress1 = 0
  }
  if (vector_1_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vectorProgress2 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vectorProgress2 = 0
  }
  if (vector_1_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vectorProgress3 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vectorProgress3 = 0
  }
  if (vector_1_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vectorProgress4 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vectorProgress4 = 0
  }
  this.vectorProgress[0] = vectorProgress1 + vectorProgress2 + vectorProgress3 + vectorProgress4
  console.log (this.vectorProgress)

  vector_2_Question1.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_2_Question2.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_2_Question3.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_2_Question4.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_2_Question5.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })

  vector_3_Question1.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_3_Question2.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_3_Question3.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })

  vector_4_Question1.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_4_Question2.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_4_Question3.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_4_Question4.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_4_Question5.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_4_Question6.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_4_Question7.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })

  vector_5_Question1.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_5_Question2.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_5_Question3.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_5_Question4.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })
  vector_5_Question5.forEach((node: HTMLInputElement, index) => {
    /* console.log(node.id, node.value, node.checked) */
  })


}


}
