import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedTextInvoiceComponent } from './posted-text-invoice.component';

describe('PostedTextInvoiceComponent', () => {
  let component: PostedTextInvoiceComponent;
  let fixture: ComponentFixture<PostedTextInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostedTextInvoiceComponent]
    });
    fixture = TestBed.createComponent(PostedTextInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
