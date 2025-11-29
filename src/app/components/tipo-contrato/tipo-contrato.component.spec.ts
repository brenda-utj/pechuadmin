import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipoContratoComponent } from './tipo-contrato.component';

describe('TipoContratoComponent', () => {
  let component: TipoContratoComponent;
  let fixture: ComponentFixture<TipoContratoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
