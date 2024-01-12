import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AnswerDTO } from 'src/app/Models/answer.dto';
import { EnvironmentalAuditsService } from 'src/app/Services/environmental-audits.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-autoevaluation-questionnaire',
  templateUrl: './autoevaluation-questionnaire.component.html',
  styleUrls: ['./autoevaluation-questionnaire.component.scss']
})
export class AutoevaluationQuestionnaireComponent {
  private userId: string | null
  questionnaireID: number | null
  questionaireSummaryAnwers: string[] = []

  constructor (
    private formBuilder: FormBuilder,
    private jwtHelper: JwtHelperService,
    private enviromentalAuditService: EnvironmentalAuditsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) {
    this.questionnaireID = +this.route.snapshot.paramMap.get('id');
    this.questionnaireID = 195
    this.userId = this.jwtHelper.decodeToken().id_ils
  }

  ngOnInit() {
    if (this.questionnaireID) {
      this.loadQuestionnaireResult(this.questionnaireID)
    }
  }

  loadQuestionnaireResult( questionnaireID: number){
    this.enviromentalAuditService.getQuestionnaireByID( questionnaireID )
      .subscribe((answers: AnswerDTO[]) => {
        console.log ("answers: ", answers)
         answers.map ((answersItem:any)=>{
          console.log ("answersItem.userAnswers: ", answersItem.userAnswers)
          JSON.parse(answersItem.userAnswers).map((item:any) => {
            console.log("item.regulation: ", item.regulation)
          })
          answersItem.userAnswers.split(",").forEach(
            (element:string) => {
                this.questionaireSummaryAnwers.push( element.split("#")[1] )
            }
          )
        }) 
      }
      )
  }
}
