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
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
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

width = '300px';
height = '300px';
hasBackdrop = true;
disableClose = false;
closeOnNavigation = true;


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
      console.log (this.questionList[3].answers)
    })
}

openDialog(enterAnimationDuration: string, exitAnimationDuration: string, toolTipText: string, questionImage: string): void {
  /* this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.objectiveService.deleteObjectives(users).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: ObjectiveDTO) => !u.isSelected
            );
          });
        }
      }); */

  this.dialog.open(ConfirmDialogComponent, {
    data: { toolTipText: toolTipText, questionImage: questionImage },
    width: '250px',
    enterAnimationDuration,
    exitAnimationDuration,
  });
}

}
