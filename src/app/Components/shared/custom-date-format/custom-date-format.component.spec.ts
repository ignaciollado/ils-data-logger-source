import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateFormatComponent } from './custom-date-format';

describe('CustomDateFormatComponent', () => {
  let component: CustomDateFormatComponent;
  let fixture: ComponentFixture<CustomDateFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDateFormatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDateFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
