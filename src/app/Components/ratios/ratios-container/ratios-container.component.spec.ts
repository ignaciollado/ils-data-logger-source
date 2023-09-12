import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatiosContainerComponent } from './ratios-container.component';

describe('RatiosContainerComponent', () => {
  let component: RatiosContainerComponent;
  let fixture: ComponentFixture<RatiosContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatiosContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatiosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
