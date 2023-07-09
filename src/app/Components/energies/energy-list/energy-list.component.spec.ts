import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyListComponent } from './energy-list.component';

describe('EnergyListComponent', () => {
  let component: EnergyListComponent;
  let fixture: ComponentFixture<EnergyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
