import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRegulationQuestionnaireContinueComponent } from './global-regulation-questionnaire-continue.component';

describe('GlobalRegulationQuestionnaireContinueComponent', () => {
  let component: GlobalRegulationQuestionnaireContinueComponent;
  let fixture: ComponentFixture<GlobalRegulationQuestionnaireContinueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalRegulationQuestionnaireContinueComponent]
    });
    fixture = TestBed.createComponent(GlobalRegulationQuestionnaireContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
