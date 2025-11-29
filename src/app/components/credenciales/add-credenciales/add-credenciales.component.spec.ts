import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCredencialesComponent } from './add-credenciales.component';

describe('AddCredencialesComponent', () => {
  let component: AddCredencialesComponent;
  let fixture: ComponentFixture<AddCredencialesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCredencialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCredencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
