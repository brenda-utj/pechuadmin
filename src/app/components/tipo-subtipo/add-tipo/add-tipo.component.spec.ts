import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTipoComponent } from './add-tipo.component';

describe('AddTipoComponent', () => {
  let component: AddTipoComponent;
  let fixture: ComponentFixture<AddTipoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
