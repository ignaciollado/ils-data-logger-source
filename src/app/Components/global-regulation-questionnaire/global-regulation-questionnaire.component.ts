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
  let vector1Progress1: number, vector1Progress2: number, vector1Progress3: number, vector1Progress4: number = 0
  let vector2Progress1: number, vector2Progress2: number, vector2Progress3: number, vector2Progress4: number, vector2Progress5: number = 0
  let vector3Progress1: number, vector3Progress2: number, vector3Progress3: number = 0
  let vector4Progress1: number, vector4Progress2: number, vector4Progress3: number, vector4Progress4: number, vector4Progress5: number, vector4Progress6: number, vector4Progress7: number = 0
  let vector5Progress1: number, vector5Progress2: number, vector5Progress3: number, vector5Progress4: number, vector5Progress5: number = 0
  let vector6Progress1: number, vector6Progress2: number, vector6Progress3: number, vector6Progress4: number, vector6Progress5: number = 0
  let vector7Progress1: number, vector7Progress2: number, vector7Progress3: number, vector7Progress4: number, vector7Progress5: number = 0

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
  let vector_2_Question2_reg : string
  let vector_2_Question3_reg : string
  let vector_2_Question4_reg : string
  let vector_2_Question5_reg : string
  let vector_2_Question1_answers: boolean [] = []
  let vector_2_Question2_answers: boolean [] = []
  let vector_2_Question3_answers: boolean [] = []
  let vector_2_Question4_answers: boolean [] = []
  let vector_2_Question5_answers: boolean [] = []

  let vector_3_Question1 = document.getElementsByName('vector_3_Question1') 
  let vector_3_Question2 = document.getElementsByName('vector_3_Question2') 
  let vector_3_Question3 = document.getElementsByName('vector_3_Question3') 
  let vector_3_Question1_reg : string
  let vector_3_Question2_reg : string
  let vector_3_Question3_reg : string
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
  let vector_4_Question2_reg : string
  let vector_4_Question3_reg : string
  let vector_4_Question4_reg : string
  let vector_4_Question5_reg : string
  let vector_4_Question6_reg : string
  let vector_4_Question7_reg : string
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
  let vector_5_Question2_reg : string
  let vector_5_Question3_reg : string
  let vector_5_Question4_reg : string
  let vector_5_Question5_reg : string
  let vector_5_Question1_answers: boolean [] = []
  let vector_5_Question2_answers: boolean [] = []
  let vector_5_Question3_answers: boolean [] = []
  let vector_5_Question4_answers: boolean [] = []
  let vector_5_Question5_answers: boolean [] = []

  let vector_6_Question1 = document.getElementsByName('vector_6_Question1') 
  let vector_6_Question2 = document.getElementsByName('vector_6_Question2') 
  let vector_6_Question3 = document.getElementsByName('vector_6_Question3') 
  let vector_6_Question4 = document.getElementsByName('vector_6_Question4')
  let vector_6_Question5 = document.getElementsByName('vector_6_Question5')
  let vector_6_Question1_reg : string
  let vector_6_Question2_reg : string
  let vector_6_Question3_reg : string
  let vector_6_Question4_reg : string
  let vector_6_Question5_reg : string
  let vector_6_Question1_answers: boolean [] = []
  let vector_6_Question2_answers: boolean [] = []
  let vector_6_Question3_answers: boolean [] = []
  let vector_6_Question4_answers: boolean [] = []
  let vector_6_Question5_answers: boolean [] = []

  let vector_7_Question1 = document.getElementsByName('vector_7_Question1') 
  let vector_7_Question2 = document.getElementsByName('vector_7_Question2') 
  let vector_7_Question3 = document.getElementsByName('vector_7_Question3') 
  let vector_7_Question4 = document.getElementsByName('vector_7_Question4')
  let vector_7_Question5 = document.getElementsByName('vector_7_Question5')
  let vector_7_Question1_reg : string
  let vector_7_Question2_reg : string
  let vector_7_Question3_reg : string
  let vector_7_Question4_reg : string
  let vector_7_Question5_reg : string
  let vector_7_Question1_answers: boolean [] = []
  let vector_7_Question2_answers: boolean [] = []
  let vector_7_Question3_answers: boolean [] = []
  let vector_7_Question4_answers: boolean [] = []
  let vector_7_Question5_answers: boolean [] = []

this.totalVectorAnswers = []
/* VECTOR 1 */
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
    vector1Progress1 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress1 = 0
  }
  if (vector_1_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress2 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress2 = 0
  }
  if (vector_1_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress3 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress3 = 0
  }
  if (vector_1_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector1Progress4 = (100/this.totalVectorQuestions[0])
  }
  if (vector_1_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector1Progress4 = 0
  }
  this.vectorProgress[0] = vector1Progress1 + vector1Progress2 + vector1Progress3 + vector1Progress4

/* VECTOR 2 */
  vector_2_Question1.forEach((node: HTMLInputElement, index) => {
    vector_2_Question1_reg = node.id+'#'+node.value+'#'+node.checked
    vector_2_Question1_answers.push(node.checked)
  })
  vector_2_Question2.forEach((node: HTMLInputElement, index) => {
    vector_2_Question2_reg = node.id+'#'+node.value+'#'+node.checked
    vector_2_Question2_answers.push(node.checked)
  })
  vector_2_Question3.forEach((node: HTMLInputElement, index) => {
    vector_2_Question3_reg = node.id+'#'+node.value+'#'+node.checked
    vector_2_Question3_answers.push(node.checked)
  })
  vector_2_Question4.forEach((node: HTMLInputElement, index) => {
    vector_2_Question4_reg = node.id+'#'+node.value+'#'+node.checked
    vector_2_Question4_answers.push(node.checked)
  })
  vector_2_Question5.forEach((node: HTMLInputElement, index) => {
    vector_2_Question5_reg = node.id+'#'+node.value+'#'+node.checked
    vector_2_Question5_answers.push(node.checked)
  })
  if (vector_2_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress1 = (100/this.totalVectorQuestions[1])
  }
  if (vector_2_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress1 = 0
  }
  if (vector_2_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress2 = (100/this.totalVectorQuestions[1])
  }
  if (vector_2_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress2 = 0
  }
  if (vector_2_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress3 = (100/this.totalVectorQuestions[1])
  }
  if (vector_2_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress3 = 0
  }
  if (vector_2_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress4 = (100/this.totalVectorQuestions[1])
  }
  if (vector_2_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress4 = 0
  }
  if (vector_2_Question5_answers.some((someItem: boolean) => someItem === true) ) {
    vector2Progress5 = (100/this.totalVectorQuestions[1])
  }
  if (vector_2_Question5_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector2Progress5 = 0
  }
  this.vectorProgress[1] = vector2Progress1 + vector2Progress2 + vector2Progress3 + vector2Progress4 + vector2Progress5

/* VECTOR 3 */
  vector_3_Question1.forEach((node: HTMLInputElement, index) => {
    vector_3_Question1_reg = node.id+'#'+node.value+'#'+node.checked
    vector_3_Question1_answers.push(node.checked)
  })
  vector_3_Question2.forEach((node: HTMLInputElement, index) => {
    vector_3_Question2_reg = node.id+'#'+node.value+'#'+node.checked
    vector_3_Question2_answers.push(node.checked)
  })
  vector_3_Question3.forEach((node: HTMLInputElement, index) => {
    vector_3_Question3_reg = node.id+'#'+node.value+'#'+node.checked
    vector_3_Question3_answers.push(node.checked)
  })
  if (vector_3_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector3Progress1 = (100/this.totalVectorQuestions[2])
  }
  if (vector_3_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector3Progress1 = 0
  }
  if (vector_3_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector3Progress2 = (100/this.totalVectorQuestions[2])
  }
  if (vector_3_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector3Progress2 = 0
  }
  if (vector_3_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector3Progress3 = (100/this.totalVectorQuestions[2])
  }
  if (vector_3_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector3Progress3 = 0
  }
  this.vectorProgress[2] = vector3Progress1 + vector3Progress2 + vector3Progress3


/* VECTOR 4 */
  vector_4_Question1.forEach((node: HTMLInputElement, index) => {
    vector_4_Question1_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question1_answers.push(node.checked)
  })
  vector_4_Question2.forEach((node: HTMLInputElement, index) => {
    vector_4_Question2_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question2_answers.push(node.checked)
  })
  vector_4_Question3.forEach((node: HTMLInputElement, index) => {
    vector_4_Question3_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question3_answers.push(node.checked)
  })
  vector_4_Question4.forEach((node: HTMLInputElement, index) => {
    vector_4_Question4_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question4_answers.push(node.checked)
  })
  vector_4_Question5.forEach((node: HTMLInputElement, index) => {
    vector_4_Question5_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question5_answers.push(node.checked)
  })
  vector_4_Question6.forEach((node: HTMLInputElement, index) => {
    vector_4_Question6_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question6_answers.push(node.checked)
  })
  vector_4_Question7.forEach((node: HTMLInputElement, index) => {
    vector_4_Question7_reg = node.id+'#'+node.value+'#'+node.checked
    vector_4_Question7_answers.push(node.checked)
  })
  if (vector_4_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress1 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress1 = 0
  }
  if (vector_4_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress2 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress2 = 0
  }
  if (vector_4_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress3 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress3 = 0
  }
  if (vector_4_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress4 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress4 = 0
  }
  if (vector_4_Question5_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress5 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question5_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress5 = 0
  }
  if (vector_4_Question6_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress6 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question6_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress6 = 0
  }
  if (vector_4_Question7_answers.some((someItem: boolean) => someItem === true) ) {
    vector4Progress7 = (100/this.totalVectorQuestions[3])
  }
  if (vector_4_Question7_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector4Progress7 = 0
  }
  this.vectorProgress[3] = vector4Progress1 + vector4Progress2 + vector4Progress3 + vector4Progress4 + vector4Progress5 + vector4Progress6 + vector4Progress7
/* VECTOR 5 */
  vector_5_Question1.forEach((node: HTMLInputElement, index) => {
    vector_5_Question1_reg = node.id+'#'+node.value+'#'+node.checked
    vector_5_Question1_answers.push(node.checked)
  })
  vector_5_Question2.forEach((node: HTMLInputElement, index) => {
    vector_5_Question2_reg = node.id+'#'+node.value+'#'+node.checked
    vector_5_Question2_answers.push(node.checked)
  })
  vector_5_Question3.forEach((node: HTMLInputElement, index) => {
    vector_5_Question3_reg = node.id+'#'+node.value+'#'+node.checked
    vector_5_Question3_answers.push(node.checked)
  })
  vector_5_Question4.forEach((node: HTMLInputElement, index) => {
    vector_5_Question4_reg = node.id+'#'+node.value+'#'+node.checked
    vector_5_Question4_answers.push(node.checked)
  })
  vector_5_Question5.forEach((node: HTMLInputElement, index) => {
    vector_5_Question5_reg = node.id+'#'+node.value+'#'+node.checked
    vector_5_Question5_answers.push(node.checked)
  })
  if (vector_5_Question1_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress1 = (100/this.totalVectorQuestions[4])
  }
  if (vector_5_Question1_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress1 = 0
  }
  if (vector_5_Question2_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress2 = (100/this.totalVectorQuestions[4])
  }
  if (vector_5_Question2_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress2 = 0
  }
  if (vector_5_Question3_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress3 = (100/this.totalVectorQuestions[4])
  }
  if (vector_5_Question3_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress3 = 0
  }
  if (vector_5_Question4_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress4 = (100/this.totalVectorQuestions[4])
  }
  if (vector_5_Question4_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress4 = 0
  }
  if (vector_5_Question5_answers.some((someItem: boolean) => someItem === true) ) {
    vector5Progress5 = (100/this.totalVectorQuestions[4])
  }
  if (vector_5_Question5_answers.every((everyItem: boolean) => everyItem === false) ) {
    vector5Progress5 = 0
  }
  this.vectorProgress[4] = vector5Progress1 + vector5Progress2 + vector5Progress3 + vector5Progress4 + vector5Progress5
}


}
