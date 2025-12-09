import { TestBed } from '@angular/core/testing';

import { VectorsService } from './vectors.service';

describe('VectorsService', () => {
  let service: VectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
