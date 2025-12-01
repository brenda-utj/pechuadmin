import { TestBed } from '@angular/core/testing';

import { CredentialModuleService } from './credential-module.service';

describe('CredentialModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CredentialModuleService = TestBed.get(CredentialModuleService);
    expect(service).toBeTruthy();
  });
});
