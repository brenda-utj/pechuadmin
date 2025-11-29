import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CredencialesComponent } from './credenciales.component';

describe('CredencialesComponent', () => {
  let component: CredencialesComponent;
  let fixture: ComponentFixture<CredencialesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CredencialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
