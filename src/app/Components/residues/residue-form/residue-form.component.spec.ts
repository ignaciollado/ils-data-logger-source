import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueFormComponent } from './residue-form.component';

describe('ResidueFormComponent', () => {
  let component: ResidueFormComponent;
  let fixture: ComponentFixture<ResidueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidueFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
