import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesApprovalComponent } from './view-sales-approval.component';

describe('ViewSalesApprovalComponent', () => {
  let component: ViewSalesApprovalComponent;
  let fixture: ComponentFixture<ViewSalesApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSalesApprovalComponent]
    });
    fixture = TestBed.createComponent(ViewSalesApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
