import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiInvoiceViewComponent } from './pi-invoice-view.component';

describe('PiInvoiceViewComponent', () => {
  let component: PiInvoiceViewComponent;
  let fixture: ComponentFixture<PiInvoiceViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiInvoiceViewComponent]
    });
    fixture = TestBed.createComponent(PiInvoiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
