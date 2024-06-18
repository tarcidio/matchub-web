import { TestBed } from '@angular/core/testing';

import { HubUserService } from './hub-user.service';

describe('HubUserService', () => {
  let service: HubUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
