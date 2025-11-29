import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InventoryMovementsComponent } from './inventory-movements.component';

describe('InventoryMovementsComponent', () => {
  let component: InventoryMovementsComponent;
  let fixture: ComponentFixture<InventoryMovementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryMovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
