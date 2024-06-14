import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceStatusComponent } from './view-invoice-status.component';

describe('ViewInvoiceStatusComponent', () => {
  let component: ViewInvoiceStatusComponent;
  let fixture: ComponentFixture<ViewInvoiceStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInvoiceStatusComponent]
    });
    fixture = TestBed.createComponent(ViewInvoiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
