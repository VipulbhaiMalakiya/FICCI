import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsCustomerComponent } from './accounts-customer.component';

describe('AccountsCustomerComponent', () => {
  let component: AccountsCustomerComponent;
  let fixture: ComponentFixture<AccountsCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsCustomerComponent]
    });
    fixture = TestBed.createComponent(AccountsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
