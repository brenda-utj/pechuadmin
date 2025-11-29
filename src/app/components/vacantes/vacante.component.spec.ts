import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipoEmpleadoComponent } from './vacante.component';

describe('TipoEmpleadoComponent', () => {
  let component: TipoEmpleadoComponent;
  let fixture: ComponentFixture<TipoEmpleadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
