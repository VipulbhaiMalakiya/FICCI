import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPiApprovalComponent } from './view-pi-approval.component';

describe('ViewPiApprovalComponent', () => {
  let component: ViewPiApprovalComponent;
  let fixture: ComponentFixture<ViewPiApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPiApprovalComponent]
    });
    fixture = TestBed.createComponent(ViewPiApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
