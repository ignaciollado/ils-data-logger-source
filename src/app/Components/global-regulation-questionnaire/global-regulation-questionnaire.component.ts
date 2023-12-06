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

theRadioType: UntypedFormControl
theChecboxType: UntypedFormControl
questionListForm: FormGroup = this.formBuilder.group({});

questionList: QuestionDTO[]
panelOpenState: boolean = true;
vectorProgress: number[] = []
totalVectorQuestions: number[] = []
totalVectorAnswers: number[] = [0]

submitted = false;

constructor (
  private formBuilder: FormBuilder,
  private enviromentalAuditService: EnvironmentalAuditsService,
  public dialog: MatDialog
) {

}

ngOnInit() {
  this.questionListForm = this.formBuilder.group({
    
});
  this.loadQuestions()
}

private loadQuestions(): void {
  this.enviromentalAuditService.getQuestionList()
    .subscribe( (questions:QuestionDTO[]) => {
      this.questionList = questions

/*      this.questionList.map ((vectors: QuestionDTO) => {
      console.log ("vector: ", vectors) */
      this.questionListForm = this.formBuilder.group({
        'vectorId' : new FormControl(this.questionList[0].vectorId, Validators.required),
        'vectorName': new FormControl(this.questionList[0].vectorName, Validators.required),
        'vectorgeneralregulation': new FormControl(this.questionList[0].vectorGeneralRegulation, Validators.required),
        'vectorQuestions': new FormControl(this.questionList[0].questions)
      })
      this.questionListForm = this.formBuilder.group({
        ...this.questionListForm.controls,
        'vectorId' : new FormControl(this.questionList[1].vectorId, Validators.required),
        'vectorName': new FormControl(this.questionList[1].vectorName, Validators.required),
        'vectorgeneralregulation': new FormControl(this.questionList[1].vectorGeneralRegulation, Validators.required),
        'vectorQuestions': new FormControl(this.questionList[1].questions)
      })
      /* this.questionListForm.addControl(
        control.name,
        this.formBuilder.control(control.value)
      ); */
    /*  })  */
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



}
