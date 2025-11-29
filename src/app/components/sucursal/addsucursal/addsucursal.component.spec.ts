import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddsucursalComponent } from './addsucursal.component';

describe('AddsucursalComponent', () => {
  let component: AddsucursalComponent;
  let fixture: ComponentFixture<AddsucursalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
