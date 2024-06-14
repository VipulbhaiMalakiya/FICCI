import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPiAccountsInboxComponent } from './view-pi-accounts-inbox.component';

describe('ViewPiAccountsInboxComponent', () => {
  let component: ViewPiAccountsInboxComponent;
  let fixture: ComponentFixture<ViewPiAccountsInboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPiAccountsInboxComponent]
    });
    fixture = TestBed.createComponent(ViewPiAccountsInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
