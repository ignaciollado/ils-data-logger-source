import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectListComponent } from './aspect-list.component';

describe('AspectListComponent', () => {
  let component: AspectListComponent;
  let fixture: ComponentFixture<AspectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AspectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
