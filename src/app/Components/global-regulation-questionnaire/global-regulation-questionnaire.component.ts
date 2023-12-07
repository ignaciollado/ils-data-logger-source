import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { Question, QuestionDTO } from 'src/app/Models/question.dto';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators, FormArray, FormGroup, FormControl, ReactiveFormsModule, FormBuilder 
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
/*       questions.map((vector: QuestionDTO) => {
        this.questionListFormTest.addControl( 'vector_'+vector.vectorId, this.formBuilder.control(vector.vectorId));
        this.questionListFormTest.addControl( 'vector_'+vector.vectorId+'_Name', this.formBuilder.control(vector.vectorName));
        this.questionListFormTest.addControl( 'vector_'+vector.vectorId+'_GeneralRegulation', this.formBuilder.control(vector.vectorGeneralRegulation));
        this.questionListFormTest.addControl( 'vector_'+vector.vectorId+'_Questions', this.formBuilder.control(vector.questions));
        this.questionListFormTest.addControl( 'vector_'+vector.vectorId+'_TotalQuestions', this.formBuilder.control(vector.questions.length));
        vector.questions.map((question:Question) => {
            console.log(question.key, question.type, question.questionTextES, question.questionTooltipES, question.questionDoc1, question.questionDoc2)
            this.questionListFormTest.addControl( 'vector_'+vector.vectorId+'_Question'+question.key, this.formBuilder.control(question.questionTextES));
        })
      }) */
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

 /*  console.log (document.getElementById('theQuestionnaire')) */

  let vector_1_Question1 = document.getElementsByName('vector_1_Question1') 
  let vector_1_Question2 = document.getElementsByName('vector_1_Question2') 
  let vector_1_Question3 = document.getElementsByName('vector_1_Question3') 
  let vector_1_Question4 = document.getElementsByName('vector_1_Question4')

  vector_1_Question1.forEach((node: HTMLElement, index) => {
    
      console.log (node, node.childNodes)

  })
/*   vector_1_Question2.forEach((node: HTMLElement, index) => {
    
    console.log (node, node.attributes)
  
}) */
/*   console.log (vector_1_Question3)
  console.log (vector_1_Question4) */

}


}
