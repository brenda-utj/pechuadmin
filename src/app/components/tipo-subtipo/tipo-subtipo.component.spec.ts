import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipoSubtipoComponent } from './tipo-subtipo.component';

describe('TipoSubtipoComponent', () => {
  let component: TipoSubtipoComponent;
  let fixture: ComponentFixture<TipoSubtipoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSubtipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSubtipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
