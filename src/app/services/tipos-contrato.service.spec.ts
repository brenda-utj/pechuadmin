import { TestBed } from '@angular/core/testing';

import { TiposContratoService } from './tipos-contrato.service';

describe('TiposContratoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiposContratoService = TestBed.get(TiposContratoService);
    expect(service).toBeTruthy();
  });
});
