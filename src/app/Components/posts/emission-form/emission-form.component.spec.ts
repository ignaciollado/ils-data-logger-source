import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionFormComponent } from './emission-form.component';

describe('EmissionFormComponent', () => {
  let component: EmissionFormComponent;
  let fixture: ComponentFixture<EmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmissionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
