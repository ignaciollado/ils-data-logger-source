import { TestBed } from '@angular/core/testing';

import { EnvironmentalAuditsService } from './environmental-audits.service';

describe('EnvironmentalAuditsService', () => {
  let service: EnvironmentalAuditsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentalAuditsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
