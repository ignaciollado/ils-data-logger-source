import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubchapterListComponent } from './subchapter-list.component';

describe('SubchapterListComponent', () => {
  let component: SubchapterListComponent;
  let fixture: ComponentFixture<SubchapterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubchapterListComponent]
    });
    fixture = TestBed.createComponent(SubchapterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
