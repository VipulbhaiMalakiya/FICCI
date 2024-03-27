import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiInvoiceViewNewComponent } from './pi-invoice-view-new.component';

describe('PiInvoiceViewNewComponent', () => {
  let component: PiInvoiceViewNewComponent;
  let fixture: ComponentFixture<PiInvoiceViewNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiInvoiceViewNewComponent]
    });
    fixture = TestBed.createComponent(PiInvoiceViewNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
