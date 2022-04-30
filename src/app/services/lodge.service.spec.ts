import { TestBed } from '@angular/core/testing';

import { LodgeService } from './lodge.service';

describe('LodgeService', () => {
  let service: LodgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LodgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
