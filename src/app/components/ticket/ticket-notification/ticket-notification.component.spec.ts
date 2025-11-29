import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketNotificationComponent } from './ticket-notification.component';

describe('TicketNotificationComponent', () => {
  let component: TicketNotificationComponent;
  let fixture: ComponentFixture<TicketNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
