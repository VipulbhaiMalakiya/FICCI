import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiInvoiceComponent } from './pi-invoice.component';

describe('PiInvoiceComponent', () => {
  let component: PiInvoiceComponent;
  let fixture: ComponentFixture<PiInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiInvoiceComponent]
    });
    fixture = TestBed.createComponent(PiInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
