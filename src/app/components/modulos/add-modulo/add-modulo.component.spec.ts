import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddModuloComponent } from './add-modulo.component';

describe('AddModuloComponent', () => {
  let component: AddModuloComponent;
  let fixture: ComponentFixture<AddModuloComponent>;

  beforeEach(waitForAsync(() => {
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
