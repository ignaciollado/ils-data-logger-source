import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoevaluationQuestionnaireComponent } from './autoevaluation-questionnaire.component';

describe('AutoevaluationQuestionnaireComponent', () => {
  let component: AutoevaluationQuestionnaireComponent;
  let fixture: ComponentFixture<AutoevaluationQuestionnaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoevaluationQuestionnaireComponent]
    });
    fixture = TestBed.createComponent(AutoevaluationQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
