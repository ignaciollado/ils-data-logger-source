import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEndPointsBackendComponent } from './test-end-points-backend.component';

describe('TestEndPointsBackendComponent', () => {
  let component: TestEndPointsBackendComponent;
  let fixture: ComponentFixture<TestEndPointsBackendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestEndPointsBackendComponent]
    });
    fixture = TestBed.createComponent(TestEndPointsBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
