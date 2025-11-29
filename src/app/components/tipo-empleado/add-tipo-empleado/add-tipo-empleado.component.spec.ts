import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTipoEmpleadoComponent } from './add-tipo-empleado.component';

describe('AddTipoEmpleadoComponent', () => {
  let component: AddTipoEmpleadoComponent;
  let fixture: ComponentFixture<AddTipoEmpleadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoEmpleadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
