import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceApprovalComponent } from './invoice-approval.component';

describe('InvoiceApprovalComponent', () => {
  let component: InvoiceApprovalComponent;
  let fixture: ComponentFixture<InvoiceApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceApprovalComponent]
    });
    fixture = TestBed.createComponent(InvoiceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
