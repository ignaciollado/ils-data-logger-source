import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRegulationQuestionnaireComponent } from './global-regulation-questionnaire.component';

describe('GlobalRegulationQuestionnaireComponent', () => {
  let component: GlobalRegulationQuestionnaireComponent;
  let fixture: ComponentFixture<GlobalRegulationQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalRegulationQuestionnaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalRegulationQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
