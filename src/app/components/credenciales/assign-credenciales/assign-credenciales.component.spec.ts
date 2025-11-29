import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignCredencialesComponent } from './assign-credenciales.component';

describe('AssignCredencialesComponent', () => {
  let component: AssignCredencialesComponent;
  let fixture: ComponentFixture<AssignCredencialesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCredencialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCredencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
