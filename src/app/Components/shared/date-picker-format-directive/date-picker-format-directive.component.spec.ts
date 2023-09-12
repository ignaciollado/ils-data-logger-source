import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerFormatDirectiveComponent } from './date-picker-format-directive';

describe('DatePickerFormatDirectiveComponent', () => {
  let component: DatePickerFormatDirectiveComponent;
  let fixture: ComponentFixture<DatePickerFormatDirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePickerFormatDirectiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerFormatDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
