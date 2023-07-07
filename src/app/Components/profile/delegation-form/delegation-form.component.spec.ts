import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationFormComponent } from './delegation-form.component';

describe('DelegationFormComponent', () => {
  let component: DelegationFormComponent;
  let fixture: ComponentFixture<DelegationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
