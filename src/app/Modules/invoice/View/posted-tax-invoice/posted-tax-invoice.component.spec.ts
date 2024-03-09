import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedTaxInvoiceComponent } from './posted-tax-invoice.component';

describe('PostedTaxInvoiceComponent', () => {
  let component: PostedTaxInvoiceComponent;
  let fixture: ComponentFixture<PostedTaxInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostedTaxInvoiceComponent]
    });
    fixture = TestBed.createComponent(PostedTaxInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
