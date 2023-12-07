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
vectorProgress: number[] = []
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
  console.log (this.questionListForm.value)
}

saveQuestionFormTest(){

 console.log (document.getElementById('theQuestionnaire')) 

  let vector_1_Question1 = document.getElementsByName('vector_1_Question1') 
  let vector_1_Question2 = document.getElementsByName('vector_1_Question2') 
  let vector_1_Question3 = document.getElementsByName('vector_1_Question3') 
  let vector_1_Question4 = document.getElementsByName('vector_1_Question4')
  let vector_1_Regulation1 = document.getElementsByName('vector_1_Regulation1') 
  let vector_1_Regulation2 = document.getElementsByName('vector_1_Regulation2') 
  let vector_1_Regulation3 = document.getElementsByName('vector_1_Regulation3') 
  let vector_1_Regulation4 = document.getElementsByName('vector_1_Regulation4')

  let vector_2_Question1 = document.getElementsByName('vector_2_Question1') 
  let vector_2_Question2 = document.getElementsByName('vector_2_Question2') 
  let vector_2_Question3 = document.getElementsByName('vector_2_Question3') 
  let vector_2_Question4 = document.getElementsByName('vector_2_Question4')
  let vector_2_Question5 = document.getElementsByName('vector_2_Question5')

  let vector_3_Question1 = document.getElementsByName('vector_3_Question1') 
  let vector_3_Question2 = document.getElementsByName('vector_3_Question2') 
  let vector_3_Question3 = document.getElementsByName('vector_3_Question3') 

  let vector_4_Question1 = document.getElementsByName('vector_4_Question1') 
  let vector_4_Question2 = document.getElementsByName('vector_4_Question2') 
  let vector_4_Question3 = document.getElementsByName('vector_4_Question3') 
  let vector_4_Question4 = document.getElementsByName('vector_4_Question4')
  let vector_4_Question5 = document.getElementsByName('vector_4_Question5')
  let vector_4_Question6 = document.getElementsByName('vector_4_Question6')
  let vector_4_Question7 = document.getElementsByName('vector_4_Question7')

  let vector_5_Question1 = document.getElementsByName('vector_5_Question1') 
  let vector_5_Question2 = document.getElementsByName('vector_5_Question2') 
  let vector_5_Question3 = document.getElementsByName('vector_5_Question3') 
  let vector_5_Question4 = document.getElementsByName('vector_5_Question4')
  let vector_5_Question5 = document.getElementsByName('vector_5_Question5')


  
  vector_1_Question1.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_1_Question2.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_1_Question3.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_1_Question4.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })

 /*  vector_1_Regulation1.forEach((node: HTMLInputElement, index) => {
    console.log(node.name, node.value, node.type)
  })
  vector_1_Regulation2.forEach((node: HTMLInputElement, index) => {
        console.log(node.name, node.value, node.type)
  })
  vector_1_Regulation3.forEach((node: HTMLInputElement, index) => {
        console.log(node.name, node.value, node.type)
  })
  vector_1_Regulation4.forEach((node: HTMLInputElement, index) => {
        console.log(node.name, node.value, node.type)
  }) */

  vector_2_Question1.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_2_Question2.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_2_Question3.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_2_Question4.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_2_Question5.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })

  vector_3_Question1.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_3_Question2.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_3_Question3.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })

  vector_4_Question1.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_4_Question2.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_4_Question3.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_4_Question4.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_4_Question5.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_4_Question6.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_4_Question7.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })

  vector_5_Question1.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_5_Question2.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_5_Question3.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_5_Question4.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })
  vector_5_Question5.forEach((node: HTMLInputElement, index) => {
    console.log(node.id, node.value, node.type, node.checked)
  })


}


}
