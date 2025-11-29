import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTipoContratoComponent } from './add-tipo-contrato.component';

describe('AddTipoContratoComponent', () => {
  let component: AddTipoContratoComponent;
  let fixture: ComponentFixture<AddTipoContratoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
