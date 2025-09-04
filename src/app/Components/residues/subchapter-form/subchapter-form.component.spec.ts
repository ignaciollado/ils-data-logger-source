import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubchapterFormComponent } from './subchapter-form.component';

describe('SubchapterFormComponent', () => {
  let component: SubchapterFormComponent;
  let fixture: ComponentFixture<SubchapterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubchapterFormComponent]
    });
    fixture = TestBed.createComponent(SubchapterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
