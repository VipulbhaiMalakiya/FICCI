import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMemoApproverEmailComponent } from './sales-memo-approver-email.component';

describe('SalesMemoApproverEmailComponent', () => {
  let component: SalesMemoApproverEmailComponent;
  let fixture: ComponentFixture<SalesMemoApproverEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesMemoApproverEmailComponent]
    });
    fixture = TestBed.createComponent(SalesMemoApproverEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
