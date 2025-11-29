import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVacanteComponent } from './show-vacante.component';

describe('ShowVacanteComponent', () => {
  let component: ShowVacanteComponent;
  let fixture: ComponentFixture<ShowVacanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVacanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowVacanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
