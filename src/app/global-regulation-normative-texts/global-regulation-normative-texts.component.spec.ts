import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRegulationNormativeTextsComponent } from './global-regulation-normative-texts.component';

describe('GlobalRegulationNormativeTextsComponent', () => {
  let component: GlobalRegulationNormativeTextsComponent;
  let fixture: ComponentFixture<GlobalRegulationNormativeTextsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalRegulationNormativeTextsComponent]
    });
    fixture = TestBed.createComponent(GlobalRegulationNormativeTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
