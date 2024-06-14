import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCreditNoteNavisionComponent } from './sales-credit-note-navision.component';

describe('SalesCreditNoteNavisionComponent', () => {
  let component: SalesCreditNoteNavisionComponent;
  let fixture: ComponentFixture<SalesCreditNoteNavisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesCreditNoteNavisionComponent]
    });
    fixture = TestBed.createComponent(SalesCreditNoteNavisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
