import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalSalesInboxComponent } from './approval-sales-inbox.component';

describe('ApprovalSalesInboxComponent', () => {
  let component: ApprovalSalesInboxComponent;
  let fixture: ComponentFixture<ApprovalSalesInboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalSalesInboxComponent]
    });
    fixture = TestBed.createComponent(ApprovalSalesInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
