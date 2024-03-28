import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSalesEmailComponent } from './credit-sales-email.component';

describe('CreditSalesEmailComponent', () => {
  let component: CreditSalesEmailComponent;
  let fixture: ComponentFixture<CreditSalesEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditSalesEmailComponent]
    });
    fixture = TestBed.createComponent(CreditSalesEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
