import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTicketComponent } from './add-ticket.component';

describe('AddTicketComponent', () => {
  let component: AddTicketComponent;
  let fixture: ComponentFixture<AddTicketComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
