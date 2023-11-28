import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRegulationQuestionnaireAnswerComponent } from './global-regulation-questionnaire-answer.component';

describe('GlobalRegulationQuestionnaireAnswerComponent', () => {
  let component: GlobalRegulationQuestionnaireAnswerComponent;
  let fixture: ComponentFixture<GlobalRegulationQuestionnaireAnswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalRegulationQuestionnaireAnswerComponent]
    });
    fixture = TestBed.createComponent(GlobalRegulationQuestionnaireAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
