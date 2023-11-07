import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnaesComponent } from './cnaes.component';

describe('PersonsComponent', () => {
  let component: CnaesComponent;
  let fixture: ComponentFixture<CnaesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnaesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CnaesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
