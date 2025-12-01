import { TestBed } from '@angular/core/testing';

import { TiposEmpleadosService } from './tipos-empleados.service';

describe('TiposEmpleadosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiposEmpleadosService = TestBed.get(TiposEmpleadosService);
    expect(service).toBeTruthy();
  });
});
