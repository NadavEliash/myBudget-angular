import { TestBed } from '@angular/core/testing';

import { MinistryService } from './ministry.service';

describe('MinistryServiceService', () => {
  let service: MinistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
