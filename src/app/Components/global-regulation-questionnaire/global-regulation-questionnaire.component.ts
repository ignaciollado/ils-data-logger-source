import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { QuestionDTO } from 'src/app/Models/question.dto';
import { TooltipPosition } from '@angular/material/tooltip';
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
questionList: QuestionDTO[]
positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
position =  this.positionOptions[0];
panelOpenState: boolean = true;
initialVector: number = 0
constructor (
  private enviromentalAuditService: EnvironmentalAuditsService,
  public dialog: MatDialog
) {}

ngOnInit() {
  this.loadQuestions()
}

private loadQuestions(): void {
  this.enviromentalAuditService.getQuestionList()
    .subscribe( (questions:QuestionDTO[]) => {
      this.questionList = questions
      console.log (this.questionList)
    })
}

openDialog(enterAnimationDuration: string, exitAnimationDuration: string, questionText: string, toolTipText: string, questionDoc: string): void {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.position = {
    'top': '2rem',
    'right': '5rem'
  };
  dialogConfig.width='100%',
  dialogConfig.data = {
    questionText: questionText, toolTipText: toolTipText, questionDoc: questionDoc
  };
  this.dialog.open(ConfirmDialogComponent, dialogConfig);
}

}
