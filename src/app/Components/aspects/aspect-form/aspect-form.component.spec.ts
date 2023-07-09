import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectFormComponent } from './aspect-form.component';

describe('AspectFormComponent', () => {
  let component: AspectFormComponent;
  let fixture: ComponentFixture<AspectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AspectFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
