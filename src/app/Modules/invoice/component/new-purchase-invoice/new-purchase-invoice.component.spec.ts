import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseInvoiceComponent } from './new-purchase-invoice.component';

describe('NewPurchaseInvoiceComponent', () => {
  let component: NewPurchaseInvoiceComponent;
  let fixture: ComponentFixture<NewPurchaseInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPurchaseInvoiceComponent]
    });
    fixture = TestBed.createComponent(NewPurchaseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
