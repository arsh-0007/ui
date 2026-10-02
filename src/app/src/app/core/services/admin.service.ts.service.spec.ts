import { TestBed } from '@angular/core/testing';

import { AdminServiceTsService } from './admin.service.ts.service';

describe('AdminServiceTsService', () => {
  let service: AdminServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
