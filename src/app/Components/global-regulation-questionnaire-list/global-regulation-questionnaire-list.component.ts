import { Component } from '@angular/core'
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { AnswerDTO } from 'src/app/Models/answer.dto'
import { questionnaireFinalStateDTO } from 'src/app/Models/answeredQuestionnaire.dto'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
import { vectorStateDetail } from 'src/app/Models/question.dto'

@Component({
  selector: 'app-global-regulation-questionnaire-list',
  templateUrl: './global-regulation-questionnaire-list.component.html',
  styleUrls: ['./global-regulation-questionnaire-list.component.scss']
})

export class GlobalRegulationQuestionnaireListComponent {
  private userId: string | null
  userQuestionnaires!: AnswerDTO[]
  questionnaireTemp: vectorStateDetail[] = []
  questionaireFinalState: questionnaireFinalStateDTO[] = []
  result: string = ''

  constructor (
    private enviromentalAuditService: EnvironmentalAuditsService,
    private jwtHelper: JwtHelperService,
    public dialog: MatDialog,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;
  }

  ngOnInit() {
    this.loadUserQuestionnaires( this.userId )
  }

  loadUserQuestionnaires( userId: string) {
    this.enviromentalAuditService.getGlobalAnswersByCompany( userId )
      .subscribe( (questionaires: AnswerDTO[]) => {
        this.userQuestionnaires = questionaires
        this.userQuestionnaires.map(( questionnaire:any ) => {
          questionnaire.completed = JSON.parse(questionnaire.completed)
          let isCompleted: boolean = true
          questionnaire.completed.map( (vectorStateDetail:any) => {
            if (parseInt(vectorStateDetail.totalAnswers) === 100)
              {
                isCompleted = (isCompleted && true)
              }
              else {
                isCompleted = (isCompleted && false)
              }
            this.questionaireFinalState
          })
          this.questionaireFinalState.push({"questionnaireId":questionnaire.companyQuestionnaireId, "questionnaireCompleted": isCompleted})
        })
      })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, questionText: string, toolTipText: string, doc1: string, doc2: string, confirmDialog: boolean): void {
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
      questionText: questionText, toolTipText: toolTipText, doc1: doc1, doc2: doc2, confirmDialog: confirmDialog
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result) {
        this.deleteUserQuestionnaire(+doc1)
      }
    });

  }

  deleteUserQuestionnaire(questionaireId: number) {
    this.enviromentalAuditService.deleteGlobalAnswer(questionaireId).subscribe(() => {
      this.loadUserQuestionnaires( this.userId )
    });
  }
}
