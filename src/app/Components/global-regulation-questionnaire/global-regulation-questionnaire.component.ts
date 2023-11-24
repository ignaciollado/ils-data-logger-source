import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { QuestionDTO } from 'src/app/Models/question.dto';

import { TooltipPosition } from '@angular/material/tooltip';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { DrawerPosition, MtxDrawer, MtxDrawerRef } from '@ng-matero/extensions/drawer';

@Component({
  selector: 'app-global-regulation-questionnaire',
  templateUrl: './global-regulation-questionnaire.component.html',
  styleUrls: ['./global-regulation-questionnaire.component.scss']
})

export class GlobalRegulationQuestionnaireComponent {
questionList: QuestionDTO[]
positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
position =  this.positionOptions[0];
mtxDialog: MtxDialog;
positionDrawer: DrawerPosition = 'right';
width = '300px';
height = '300px';
hasBackdrop = true;
disableClose = false;
closeOnNavigation = true;
  drawer: MtxDrawer;

constructor (
  private enviromentalAuditService: EnvironmentalAuditsService,
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

}

