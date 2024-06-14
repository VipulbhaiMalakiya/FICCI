import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMemoStatusComponent } from './credit-memo-status.component';

describe('CreditMemoStatusComponent', () => {
  let component: CreditMemoStatusComponent;
  let fixture: ComponentFixture<CreditMemoStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditMemoStatusComponent]
    });
    fixture = TestBed.createComponent(CreditMemoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
