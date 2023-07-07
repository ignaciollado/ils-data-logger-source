import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationListComponent } from './delegation-list.component';

describe('DelegationComponent', () => {
  let component: DelegationListComponent;
  let fixture: ComponentFixture<DelegationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
