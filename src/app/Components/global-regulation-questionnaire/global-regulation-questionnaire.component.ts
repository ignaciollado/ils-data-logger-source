import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { QuestionDTO } from 'src/app/Models/question.dto';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
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

@Component({
  selector: 'app-global-regulation-questionnaire',
  templateUrl: './global-regulation-questionnaire.component.html',
  styleUrls: ['./global-regulation-questionnaire.component.scss']
})

export class GlobalRegulationQuestionnaireComponent {

theRadioType: UntypedFormControl
theChecboxType: UntypedFormControl
questionListForm: UntypedFormGroup

questionList: QuestionDTO[]
panelOpenState: boolean = true;
vectorProgress: number[] = []
totalVectorQuestions: number[] = []
totalVectorAnswers: number[] = [0]


constructor (
  private formBuilder: UntypedFormBuilder,
  private enviromentalAuditService: EnvironmentalAuditsService,
  public dialog: MatDialog
) {

  this.questionListForm = this.formBuilder.group({
    theRadioType: this.theRadioType,
    theChecboxType: this.theChecboxType,
  })
}

ngOnInit() {
  this.loadQuestions()
}

private loadQuestions(): void {
  this.enviromentalAuditService.getQuestionList()
    .subscribe( (questions:QuestionDTO[]) => {
      this.questionList = questions
      questions.map( (item:any) => {
        this.totalVectorQuestions.push(item['questions'].length)
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
