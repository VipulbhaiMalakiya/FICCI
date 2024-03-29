import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCreditEmailComponent } from './sales-credit-email.component';

describe('SalesCreditEmailComponent', () => {
  let component: SalesCreditEmailComponent;
  let fixture: ComponentFixture<SalesCreditEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesCreditEmailComponent]
    });
    fixture = TestBed.createComponent(SalesCreditEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
