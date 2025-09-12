import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyFormComponent } from './energy-form.component';

describe('EnergyFormComponent', () => {
  let component: EnergyFormComponent;
  let fixture: ComponentFixture<EnergyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnergyFormComponent]
    });
    fixture = TestBed.createComponent(EnergyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
