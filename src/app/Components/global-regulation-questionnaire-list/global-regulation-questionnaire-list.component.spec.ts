import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRegulationQuestionnaireListComponent } from './global-regulation-questionnaire-list.component';

describe('GlobalRegulationQuestionnaireListComponent', () => {
  let component: GlobalRegulationQuestionnaireListComponent;
  let fixture: ComponentFixture<GlobalRegulationQuestionnaireListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalRegulationQuestionnaireListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalRegulationQuestionnaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
