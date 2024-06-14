import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalCustomerComponent } from './approval-customer.component';

describe('ApprovalCustomerComponent', () => {
  let component: ApprovalCustomerComponent;
  let fixture: ComponentFixture<ApprovalCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalCustomerComponent]
    });
    fixture = TestBed.createComponent(ApprovalCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
