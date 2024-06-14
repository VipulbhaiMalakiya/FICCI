import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMemoViewComponent } from './credit-memo-view.component';

describe('CreditMemoViewComponent', () => {
  let component: CreditMemoViewComponent;
  let fixture: ComponentFixture<CreditMemoViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditMemoViewComponent]
    });
    fixture = TestBed.createComponent(CreditMemoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
