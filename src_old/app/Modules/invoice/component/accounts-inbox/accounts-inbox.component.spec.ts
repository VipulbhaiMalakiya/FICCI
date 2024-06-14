import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsInboxComponent } from './accounts-inbox.component';

describe('AccountsInboxComponent', () => {
  let component: AccountsInboxComponent;
  let fixture: ComponentFixture<AccountsInboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsInboxComponent]
    });
    fixture = TestBed.createComponent(AccountsInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
