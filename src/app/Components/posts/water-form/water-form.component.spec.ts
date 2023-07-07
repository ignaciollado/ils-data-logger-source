import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterFormComponent } from './water-form.component';

describe('WaterFormComponent', () => {
  let component: WaterFormComponent;
  let fixture: ComponentFixture<WaterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
