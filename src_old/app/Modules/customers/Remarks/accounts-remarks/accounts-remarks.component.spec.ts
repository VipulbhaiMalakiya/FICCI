import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsRemarksComponent } from './accounts-remarks.component';

describe('AccountsRemarksComponent', () => {
  let component: AccountsRemarksComponent;
  let fixture: ComponentFixture<AccountsRemarksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsRemarksComponent]
    });
    fixture = TestBed.createComponent(AccountsRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
