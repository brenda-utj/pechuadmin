import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModuloComponent } from './add-modulo.component';

describe('AddModuloComponent', () => {
  let component: AddModuloComponent;
  let fixture: ComponentFixture<AddModuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
