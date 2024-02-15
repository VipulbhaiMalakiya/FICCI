import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCustomerComponent } from './status-customer.component';

describe('StatusCustomerComponent', () => {
  let component: StatusCustomerComponent;
  let fixture: ComponentFixture<StatusCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusCustomerComponent]
    });
    fixture = TestBed.createComponent(StatusCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
