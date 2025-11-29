import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModulosComponent } from './modulos.component';

describe('ModulosComponent', () => {
  let component: ModulosComponent;
  let fixture: ComponentFixture<ModulosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
