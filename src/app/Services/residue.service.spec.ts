import { TestBed } from '@angular/core/testing';

import { ResidueService } from './residue.service';

describe('ResidueService', () => {
  let service: ResidueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
