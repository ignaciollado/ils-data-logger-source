import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueAdminFormComponent } from './residue-admin-form.component';

describe('ResidueAdminFormComponent', () => {
  let component: ResidueAdminFormComponent;
  let fixture: ComponentFixture<ResidueAdminFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidueAdminFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidueAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
