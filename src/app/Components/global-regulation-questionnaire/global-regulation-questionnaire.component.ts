import { Component } from '@angular/core';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { QuestionDTO } from 'src/app/Models/question.dto';

@Component({
  selector: 'app-global-regulation-questionnaire',
  templateUrl: './global-regulation-questionnaire.component.html',
  styleUrls: ['./global-regulation-questionnaire.component.scss']
})
export class GlobalRegulationQuestionnaireComponent {
questionList: QuestionDTO[]
constructor (
  private enviromentalAuditService: EnvironmentalAuditsService,

) {

}

ngOnInit() {
  this.loadQuestions()
}

private loadQuestions(): void {
  this.enviromentalAuditService.getQuestionList()
    .subscribe( (questions:QuestionDTO[]) => {
      this.questionList = questions
      console.log (this.questionList )
    })
}
}
