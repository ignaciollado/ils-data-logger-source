import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueListComponent } from './residue-list.component';

describe('ResidueListComponent', () => {
  let component: ResidueListComponent;
  let fixture: ComponentFixture<ResidueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
